import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { KafkaProducerService } from '../kafka/kafka.producer.service';

@Injectable()
export class FailedNotificationService {
  private readonly logger = new Logger(FailedNotificationService.name);

  constructor(
    private readonly prismService: PrismaService,
    private readonly kafkaProducerService: KafkaProducerService
  ) {}

  public async retryFailedNotification(notificationId: string): Promise<void> {
    const failedNotificationData = await this.prismService.failedNotifications.findFirst({
      where: {
        notification_id: notificationId,
      },
      include: {
        notifications: true,
      },
    });

    if (!failedNotificationData) {
      this.logger.error(`Failed notification with id ${notificationId} not found`);
      return;
    }

    if (failedNotificationData.retry_count < 3) {
      await this.kafkaProducerService.publishNotification({
        user_id: failedNotificationData.notifications.user_id,
        type: failedNotificationData.notifications.type,
        content: JSON.stringify(failedNotificationData.notifications.content),
      });

      await this.prismService.failedNotifications.update({
        where: {
          id: failedNotificationData.id,
        },
        data: {
          retry_count: failedNotificationData.retry_count + 1,
          last_retry_at: new Date(),
        },
      });
    } else {
      this.logger.error(
        `Failed notification with id ${notificationId} has reached the maximum retry count`
      );
    }
  }
}
