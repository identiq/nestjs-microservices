import { Controller } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import {
  FindManyDto,
  WebhookCreateDto,
  WebhookServiceCommand,
} from '@webhooks-manager/data';
import { WebhookService } from './webhook.service';

@Controller()
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}

  @MessagePattern({ cmd: WebhookServiceCommand.FindMany })
  findMany(@Ctx() context: RmqContext, @Payload() args?: FindManyDto) {
    return this.webhookService.findMany(args);
  }

  @MessagePattern({ cmd: WebhookServiceCommand.Create })
  create(@Ctx() context: RmqContext, @Payload() data: WebhookCreateDto) {
    return this.webhookService.create(data);
  }
}
