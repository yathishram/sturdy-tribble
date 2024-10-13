import { Injectable, Inject, Logger } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { NotificationTypes } from '@prisma/client';
import { NotificationPayload } from 'src/types/notification';

@Injectable()
export class KafkaProducerService {
  private readonly logger = new Logger(KafkaProducerService.name);

  constructor(@Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka) {}

  private getTopicByNotificationType(notificationType: NotificationTypes) {
    switch (notificationType) {
      case NotificationTypes.EMAIL:
        return 'email_notifications';
      case NotificationTypes.SMS:
        return 'sms_notifications';
      case NotificationTypes.PUSH:
        return 'push_notifications';
      case NotificationTypes.IN_APP:
        return 'in_app_notifications';
    }
  }

  public async publishNotification(notification: NotificationPayload): Promise<void> {
    console.log('Publishing notification:', notification);

    const topic = this.getTopicByNotificationType(notification.type);

    console.log('Publishing notification to topic:', topic);

    await this.kafkaClient.emit(topic, JSON.stringify(notification));
  }
}
