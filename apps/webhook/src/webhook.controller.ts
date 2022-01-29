import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { Prisma } from '@prisma/client';

import { WebhookService } from './webhook.service';

@Controller()
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}

  @MessagePattern('webhooks_find_many')
  findMany(args?: Prisma.WebhookFindManyArgs) {
    return this.webhookService.findMany(args);
  }
}
