import { HttpStatus } from '@nestjs/common';
import {
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
  PrismaClientValidationError,
} from '@prisma/client/runtime';
import { ServiceMessage } from './message.enum';

export interface ServiceResponseDto<T> {
  statusCode: HttpStatus;
  message: ServiceMessage | string[];
  data?: T;
  error?:
    | PrismaClientKnownRequestError
    | PrismaClientUnknownRequestError
    | PrismaClientValidationError;
}
