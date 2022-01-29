/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { GatewayModule } from './gateway.module';

async function bootstrap() {
  const app = await NestFactory.create(GatewayModule);
  const config = app.get(ConfigService);
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  const port = config.get('API_GATEWAY_PORT', 8000);
  await app.listen(+port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();
