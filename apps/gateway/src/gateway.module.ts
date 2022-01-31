import { Module } from '@nestjs/common';
import {
  ClientOptions,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { GatewayController } from './gateway.controller';
import { AuthModule } from '@webhooks-manager/auth';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';

import { multistream } from 'pino';
import pretty from 'pino-pretty';
import { createLogtailTransport } from '@webhooks-manager/data';

@Module({
  imports: [
    LoggerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        const token = config.get<string>('LOGTAIL_TOKEN');
        return {
          pinoHttp: [
            {
              name: 'gateway',
              level: 'debug',
            },
            multistream([
              {
                level: 'info',
                stream: createLogtailTransport(token),
              },
              {
                stream: pretty({
                  colorize: true,
                  levelFirst: true,
                  translateTime: true,
                }),
              },
            ]),
          ],
        };
      },
    }),
    ConfigModule,
    AuthModule,
  ],
  controllers: [GatewayController],
  providers: [
    {
      provide: 'WEBHOOK_SERVICE',
      useFactory: (configService: ConfigService) => {
        const urls = [configService.get('RABBIT_DSN', 'amqp://localhost:5672')];
        const queue = configService.get('WEBHOOK_QUEUE', 'webhook');
        return ClientProxyFactory.create({
          transport: Transport.RMQ,
          options: {
            urls,
            queue,
            queueOptions: {
              durable: false,
            },
          },
        } as ClientOptions);
      },
      inject: [ConfigService],
    },
  ],
})
export class GatewayModule {}
