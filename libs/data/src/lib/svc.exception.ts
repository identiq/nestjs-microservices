import { HttpStatus } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

export interface ISvcException {
  message: string | object;
  status: HttpStatus;
  error: Error;
}

export class SvcException extends RpcException {
  constructor(error: ISvcException) {
    super(error);
  }

  status: number;
}
