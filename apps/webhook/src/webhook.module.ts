import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { WebhookController } from './webhook.controller';
import { WebhookService } from './webhook.service';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [WebhookController],
  providers: [WebhookService],
})
export class WebhookModule {}
