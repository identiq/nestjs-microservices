import { Injectable } from '@nestjs/common';
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class AppService {
  findMany(args?: Prisma.WebhookFindManyArgs) {
    return prisma.webhook.findMany(args);
  }
}
