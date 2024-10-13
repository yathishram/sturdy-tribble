import { Injectable } from '@nestjs/common';
import { Payload } from '@nestjs/microservices';

@Injectable()
export class EmailNotificationService {
  async handleNotification(@Payload() payload: any) {
    console.log('Email notification sent', payload);
  }
}
