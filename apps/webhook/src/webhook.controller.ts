import { Controller, UseInterceptors } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import {
  FindManyDto,
  WebhookCreateDto,
  SvcCommand,
  PrismaInterceptor,
} from '@webhooks-manager/data';
import { WebhookService } from './webhook.service';

@UseInterceptors(PrismaInterceptor)
@Controller()
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}

  @MessagePattern(SvcCommand.WebhookFindMany)
  findMany(@Ctx() context: RmqContext, @Payload() args?: FindManyDto) {
    return this.webhookService.findMany(args);
  }

  @MessagePattern(SvcCommand.WebhookCreate)
  create(@Ctx() context: RmqContext, @Payload() data: WebhookCreateDto) {
    return this.webhookService.create(data);
  }
}
