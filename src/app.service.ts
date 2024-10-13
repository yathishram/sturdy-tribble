import { Injectable } from '@nestjs/common';
import { NotificationTypes } from '@prisma/client';
import { NotificationPayload } from './types/notification';
import { KafkaProducerService } from './services/kafka/kafka.producer.service';

@Injectable()
export class AppService {
  constructor(private readonly kafkaProducerService: KafkaProducerService) {}

  getHello(): string {
    return 'Hello World!';
  }

  public async createNotification({
    userId,
    notificationType,
    content,
    scheduledAt,
  }: {
    userId: string;
    notificationType: NotificationTypes;
    content: Record<string, unknown>;
    scheduledAt?: Date;
  }): Promise<{
    message: string;
  }> {
    const notification: NotificationPayload = {
      user_id: userId,
      type: notificationType,
      content: JSON.stringify(content),
      scheduled_at: scheduledAt,
    };

    this.kafkaProducerService.publishNotification(notification);

    return {
      message: 'Notification created successfully',
    };
  }
}
