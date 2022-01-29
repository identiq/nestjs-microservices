import { Controller } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { FindManyDto } from '@webhooks-manager/data';
import { WebhookService } from './webhook.service';

@Controller()
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}

  @MessagePattern({ cmd: 'webhooks_find_many' })
  findMany(@Ctx() context: RmqContext, @Payload() args?: FindManyDto) {
    return this.webhookService.findMany(args);
  }
}
