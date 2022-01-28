import { Module } from '@nestjs/common';
import { ClientProxyFactory } from '@nestjs/microservices';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from '@webhooks-manager/auth';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [AuthModule, ConfigModule.forRoot()],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: 'WEBHOOK_SERVICE',
      useFactory: (configService: ConfigService) => {
        const host = configService.get('WEBHOOK_SERVICE_HOST', '127.0.0.1');
        const port = +configService.get('WEBHOOK_SERVICE_PORT', 8001);
        return ClientProxyFactory.create({
          options: {
            host,
            port,
          },
        });
      },
      inject: [ConfigService],
    },
  ],
})
export class AppModule {}
