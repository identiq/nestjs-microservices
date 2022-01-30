import { Body, Controller, Get, Inject, Post, Query } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Webhook } from '@prisma/client';
import { firstValueFrom } from 'rxjs';
import {
  FindManyDto,
  ServiceResponseDto,
  WebhookCreateDto,
  WebhookServiceCommand,
} from '@webhooks-manager/data';

@Controller()
export class GatewayController {
  constructor(
    @Inject('WEBHOOK_SERVICE')
    private readonly webhookServiceClient: ClientProxy
  ) {}

  @Get()
  findMany(@Query() dto: FindManyDto) {
    return firstValueFrom(
      this.webhookServiceClient.send<ServiceResponseDto<Webhook[]>>(
        { cmd: WebhookServiceCommand.FindMany },
        dto
      )
    );
  }

  @Post()
  create(@Body() data: WebhookCreateDto) {
    return firstValueFrom(
      this.webhookServiceClient.send<ServiceResponseDto<Webhook>>(
        { cmd: WebhookServiceCommand.Create },
        data
      )
    );
  }
}
