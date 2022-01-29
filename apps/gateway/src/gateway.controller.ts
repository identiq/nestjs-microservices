import { Controller, Get, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Prisma, PrismaPromise, Webhook } from '@prisma/client';
import { firstValueFrom } from 'rxjs';

@Controller()
export class GatewayController {
  constructor(
    @Inject('WEBHOOK_SERVICE')
    private readonly webhookServiceClient: ClientProxy
  ) {}

  @Get()
  findMany() {
    return firstValueFrom(
      this.webhookServiceClient.send<PrismaPromise<Webhook[]>>(
        'webhooks_find_many',
        {} as Prisma.WebhookFindManyArgs
      )
    );
  }
}
