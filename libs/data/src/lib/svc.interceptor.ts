import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable, throwError, TimeoutError } from 'rxjs';
import { catchError, timeout, take, map, tap } from 'rxjs/operators';
import { SvcMessage } from './svc.message';
import { SvcException } from './svc.exception';
import { SvcResponse } from '..';

@Injectable()
export class SvcInterceptor implements NestInterceptor {
  private logger = new Logger('Svc');

  constructor(private readonly configService: ConfigService) {}

  get ms() {
    return +this.configService.get('API_GATEWAY_TIMEOUT', 5000);
  }

  diff({ timestamp }: Pick<SvcResponse<unknown>, 'timestamp'>) {
    return new Date().getTime() - new Date(timestamp).getTime();
  }

  intercept(
    context: ExecutionContext,
    next: CallHandler<SvcResponse<unknown>>
  ): Observable<unknown> {
    return next.handle().pipe(
      tap((data) =>
        this.logger.log(`${data.status} - ${data.message} in ${this.diff(data)}ms`)
      ),
      take(1),
      map((data) => data.data),
      timeout(this.ms),
      catchError((err: SvcException | TimeoutError | HttpException) => {
        this.logger.error(err);
        if (err instanceof TimeoutError) {
          return throwError(
            () =>
              new HttpException(SvcMessage.Timeout, HttpStatus.GATEWAY_TIMEOUT)
          );
        }

        if (err instanceof SvcException) {
          return throwError(
            () =>
              new HttpException(
                err.message,
                err.status || HttpStatus.BAD_REQUEST
              )
          );
        }

        return throwError(() => err);
      })
    );
  }
}
