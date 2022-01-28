import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { Prisma } from '@prisma/client';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern('webhooks_find_many')
  findMany(args?: Prisma.WebhookFindManyArgs) {
    return this.appService.findMany(args);
  }
}
