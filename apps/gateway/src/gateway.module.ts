import { Module } from '@nestjs/common';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { GatewayController } from './gateway.controller';
import { AuthModule } from '@webhooks-manager/auth';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [AuthModule, ConfigModule.forRoot()],
  controllers: [GatewayController],
  providers: [
    {
      provide: 'WEBHOOK_SERVICE',
      useFactory: (configService: ConfigService) => {
        const queue = configService.get('WEBHOOK_QUEUE', 'webhook');
        return ClientProxyFactory.create({
          options: {
            transport: Transport.RMQ,
            urls: [configService.get('RABBIT_DSN', 'amqp://localhost:5672')],
            queue,
            queueOptions: {
              durable: false,
            },
          },
        });
      },
      inject: [ConfigService],
    },
  ],
})
export class GatewayModule {}
