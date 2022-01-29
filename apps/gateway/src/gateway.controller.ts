import { Controller, Get, Inject, Query } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { PrismaPromise, Webhook } from '@prisma/client';
import { firstValueFrom } from 'rxjs';
import { FindManyDto } from '@webhooks-manager/data';

@Controller()
export class GatewayController {
  constructor(
    @Inject('WEBHOOK_SERVICE')
    private readonly webhookServiceClient: ClientProxy
  ) {}

  @Get()
  findMany(@Query() args: FindManyDto) {
    return firstValueFrom(
      this.webhookServiceClient.send<PrismaPromise<Webhook[]>, FindManyDto>(
        { cmd: 'webhooks_find_many' },
        args
      )
    );
  }
}
