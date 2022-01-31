import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaClient, Prisma } from '@prisma/client';
import {
  SvcException,
  SvcMessage,
  WebhookCreateDto,
} from '@webhooks-manager/data';

const prisma = new PrismaClient();

@Injectable()
export class WebhookService {
  findMany(args?: Prisma.WebhookFindManyArgs) {
    return prisma.webhook.findMany(args);
  }

  create(data: WebhookCreateDto) {
    if (!data.address.startsWith('https')) {
      throw new SvcException({
        status: HttpStatus.BAD_REQUEST,
        message: SvcMessage.WebhookValidationAddressSsl,
      });
    }
    return prisma.webhook.create({ data });
  }
}
