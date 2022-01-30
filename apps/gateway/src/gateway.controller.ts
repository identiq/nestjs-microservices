import { Body, Controller, Get, Inject, Post, Query } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxy } from '@nestjs/microservices';
import { Webhook } from '@prisma/client';
import {
  FindManyDto,
  ServiceResponseDto,
  WebhookCreateDto,
  WebhookServiceCommand,
  timeoutify,
} from '@webhooks-manager/data';

@Controller()
export class GatewayController {
  constructor(
    @Inject('WEBHOOK_SERVICE')
    private readonly webhookServiceClient: ClientProxy,
    private readonly configService: ConfigService
  ) {}

  get timeout() {
    return +this.configService.get('API_GATEWAY_TIMEOUT', 5000);
  }

  @Get()
  async findMany(@Query() dto: FindManyDto) {
    return timeoutify(
      this.webhookServiceClient.send<ServiceResponseDto<Webhook[]>>(
        { cmd: WebhookServiceCommand.FindMany },
        dto
      ),
      this.timeout
    );
  }

  @Post()
  create(@Body() data: WebhookCreateDto) {
    return timeoutify(
      this.webhookServiceClient.send<ServiceResponseDto<Webhook>>(
        { cmd: WebhookServiceCommand.Create },
        data
      ),
      this.timeout
    );
  }
}
