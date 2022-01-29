/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Transport, TcpOptions, RmqOptions } from '@nestjs/microservices';
import { WebhookModule } from './webhook.module';

const urls = [process.env.RABBIT_DSN || 'amqp://localhost:5672'];
const queue = process.env.WEBHOOK_QUEUE || 'webhook';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<RmqOptions>(WebhookModule, {
    transport: Transport.RMQ,
    options: {
      urls,
      queue,
      queueOptions: {
        durable: false,
      },
    },
  });
  app.listen();
  Logger.log(`🚀 Queue is running on: ${queue}`);
}

bootstrap();
