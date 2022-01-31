import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';

import { WebhookController } from './webhook.controller';
import { WebhookService } from './webhook.service';
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
  ],
  controllers: [WebhookController],
  providers: [WebhookService],
})
export class WebhookModule {}
