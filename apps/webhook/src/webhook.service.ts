import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaClient, Prisma, Webhook } from '@prisma/client';
import {
  SvcResponse,
  SvcException,
  WebhookCreateDto,
  WebhookSvcMessage,
} from '@webhooks-manager/data';
import { PrismaError } from 'prisma-error-enum';

const prisma = new PrismaClient();

@Injectable()
export class WebhookService {
  async findMany(
    args?: Prisma.WebhookFindManyArgs
  ): Promise<SvcResponse<Webhook[]>> {
    try {
      const data = await prisma.webhook.findMany(args);

      return new SvcResponse<Webhook[]>({
        status: HttpStatus.OK,
        message: WebhookSvcMessage.FindManySuccess,
        data,
      });
    } catch (error) {
      throw new SvcException({
        status: HttpStatus.BAD_REQUEST,
        message: WebhookSvcMessage.FindManyBadRequest,
        error,
      });
    }
  }

  async create(data: WebhookCreateDto): Promise<SvcResponse<Webhook>> {
    try {
      const webhook = await prisma.webhook.create({ data });

      return new SvcResponse<Webhook>({
        status: HttpStatus.CREATED,
        message: WebhookSvcMessage.Created,
        data: webhook,
      });
    } catch (error) {
      if (error.code === PrismaError.UniqueConstraintViolation) {
        throw new SvcException({
          status: HttpStatus.CONFLICT,
          message: WebhookSvcMessage.Conflit,
          error,
        });
      }

      throw new SvcException({
        status: HttpStatus.BAD_REQUEST,
        message: WebhookSvcMessage.FindManyBadRequest,
        error,
      });
    }
  }
}
