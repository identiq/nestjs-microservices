import { Module } from '@nestjs/common';
import {
  ClientOptions,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { GatewayController } from './gateway.controller';
import { AuthModule } from '@webhooks-manager/auth';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [ConfigModule, AuthModule],
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
