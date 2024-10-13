import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './services/database/prisma.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { kafkaConfig } from './config/kafka.config';
import { NotificationProcessorService } from './services/kafka/kafka.processor.service';
import { FailedNotificationService } from './services/notification/failed-notification.service';
import { KafkaProducerService } from './services/kafka/kafka.producer.service';

@Module({
  imports: [PrismaModule, ClientsModule.register([{ name: 'KAFKA_SERVICE', ...kafkaConfig }])],
  controllers: [AppController],
  providers: [
    AppService,
    NotificationProcessorService,
    FailedNotificationService,
    KafkaProducerService,
  ],
})
export class AppModule {}
