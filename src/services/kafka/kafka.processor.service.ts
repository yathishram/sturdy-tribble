import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientKafka, EventPattern, Payload } from '@nestjs/microservices';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class NotificationProcessorService implements OnModuleInit {
  constructor(
    @Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka, // Ensure correct injection
    private readonly prismaService: PrismaService
  ) {}

  async onModuleInit() {
    // Subscribing to topics
    // this.kafkaClient.subscribeToResponseOf('email_notifications');
    // this.kafkaClient.subscribeToResponseOf('sms_notifications');
    // this.kafkaClient.subscribeToResponseOf('push_notifications');
    // this.kafkaClient.subscribeToResponseOf('in_app_notifications');

    await this.kafkaClient.connect();
    console.log('Kafka client connected and subscribed to topics');
  }

  @EventPattern('email_notifications')
  async handleEmailNotification(@Payload() payload: any) {
    console.log('Email notification received:', payload);
  }

  @EventPattern('sms_notifications')
  async handleSmsNotification(@Payload() payload: any) {
    console.log('SMS notification received:', payload);
  }

  @EventPattern('push_notifications')
  async handlePushNotification(@Payload() payload: any) {
    console.log('Push notification received:', payload);
  }

  @EventPattern('in_app_notifications')
  async handleInAppNotification(@Payload() payload: any) {
    console.log('In-app notification received:', payload);
  }
}
