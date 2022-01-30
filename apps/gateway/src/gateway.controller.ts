import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Webhook } from '@prisma/client';
import {
  FindManyDto,
  SvcResponse,
  SvcInterceptor,
  WebhookCreateDto,
  SvcCommand,
} from '@webhooks-manager/data';

@Controller()
@UseInterceptors(SvcInterceptor)
export class GatewayController {
  constructor(
    @Inject('WEBHOOK_SERVICE')
    private readonly webhookServiceClient: ClientProxy
  ) {}

  @Get()
  async findMany(@Query() dto: FindManyDto) {
    return this.webhookServiceClient.send<SvcResponse<Webhook[]>, FindManyDto>(
      SvcCommand.WebhookFindMany,
      dto
    );
  }

  @Post()
  create(@Body() dto: WebhookCreateDto) {
    return this.webhookServiceClient.send<
      SvcResponse<Webhook>,
      WebhookCreateDto
    >(SvcCommand.WebhookCreate, dto);
  }
}
