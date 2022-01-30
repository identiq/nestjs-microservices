import { HttpStatus } from '@nestjs/common';
import { SvcMessage } from './svc.message';

export class SvcResponse<T> {
  constructor(object: Omit<SvcResponse<T>, 'timestamp'>) {
    this.timestamp = new Date();
    Object.assign(this, object);
  }

  status: HttpStatus;
  message: SvcMessage | string[];
  data?: T;
  error?: Error;
  timestamp: Date;
}
