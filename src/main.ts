import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { kafkaConfig } from './config/kafka.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice(kafkaConfig);

  await app.startAllMicroservices();

  await app.listen(3000);
}
bootstrap();
