import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { NotificationTypes } from '@prisma/client';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('notifications')
  async createNotification(
    @Body()
    body: {
      userId: string;
      notificationType: NotificationTypes;
      content: Record<string, unknown>;
      scheduledAt?: string;
    }
  ): Promise<{ message: string }> {
    return this.appService.createNotification({
      userId: body.userId,
      notificationType: body.notificationType,
      content: body.content,
      scheduledAt: new Date(body.scheduledAt),
    });
  }
}
