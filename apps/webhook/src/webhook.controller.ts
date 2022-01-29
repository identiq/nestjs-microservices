import { Controller } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { Prisma } from '@prisma/client';

import { WebhookService } from './webhook.service';

@Controller()
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}

  @MessagePattern({ cmd: 'webhooks_find_many' })
  findMany(
    @Ctx() context: RmqContext,
    @Payload() args?: Prisma.WebhookFindManyArgs
  ) {
    return this.webhookService.findMany(args);
  }
}
