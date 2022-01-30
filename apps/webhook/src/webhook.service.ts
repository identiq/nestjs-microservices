import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaClient, Prisma, Webhook } from '@prisma/client';
import {
  ServiceResponseDto,
  WebhookCreateDto,
  WebhookServiceMessage,
} from '@webhooks-manager/data';
import { PrismaError } from 'prisma-error-enum';

const prisma = new PrismaClient();

@Injectable()
export class WebhookService {
  async findMany(
    args?: Prisma.WebhookFindManyArgs
  ): Promise<ServiceResponseDto<Webhook[]>> {
    try {
      const data = await prisma.webhook.findMany(args);
      
      return {
        statusCode: HttpStatus.OK,
        message: WebhookServiceMessage.FindManySuccess,
        data,
      };
    } catch (error) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: WebhookServiceMessage.FindManyBadRequest,
        error,
      };
    }
  }

  async create(data: WebhookCreateDto): Promise<ServiceResponseDto<Webhook>> {
    try {
      const webhook = await prisma.webhook.create({ data });

      return {
        statusCode: HttpStatus.CREATED,
        message: WebhookServiceMessage.Created,
        data: webhook,
      };
    } catch (error) {
      if (error.code === PrismaError.UniqueConstraintViolation) {
        return {
          statusCode: HttpStatus.CONFLICT,
          message: WebhookServiceMessage.Conflit,
          error,
        };
      }

      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: WebhookServiceMessage.FindManyBadRequest,
        error,
      };
    }
  }
}
