import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import type { OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient, Prisma } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private logger = new Logger(PrismaService.name);

  public constructor() {
    super({
      log: [{ level: 'query', emit: 'event' }],
    });
  }

  public async onModuleInit(): Promise<void> {
    await this.$connect();
  }

  public async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }

  public async truncate(): Promise<void> {
    const records = await this.$queryRawUnsafe<Array<{ tablename: string }>>(`SELECT tablename
                                                          FROM pg_tables
                                                          WHERE schemaname = 'public'`);
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    records.forEach((record) => this.truncateTable(record.tablename));
  }

  private async truncateTable(tablename): Promise<void> {
    if (tablename === undefined || tablename === '_prisma_migrations') {
      return;
    }

    try {
      await this.$executeRawUnsafe(`TRUNCATE TABLE "public"."${tablename}" CASCADE;`);
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      this.logger.error(JSON.stringify({ error }));
    }
  }

  public async resetSequences(): Promise<void> {
    const results = await this.$queryRawUnsafe<Array<{ relname }>>(
      `SELECT c.relname
       FROM pg_class AS c
                JOIN pg_namespace AS n ON c.relnamespace = n.oid
       WHERE c.relkind = 'S'
         AND n.nspname = 'public'`
    );
    for (const record of results) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      await this.$executeRawUnsafe(`ALTER SEQUENCE "public"."${record.relname}" RESTART WITH 1;`);
    }
  }
}
