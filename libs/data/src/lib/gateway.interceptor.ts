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
import { catchError, timeout, take, tap } from 'rxjs/operators';
import { SvcMessage } from './svc.message';
import { SvcException } from './svc.exception';
import { snakeCase } from './utils';

@Injectable()
export class GatewayInterceptor implements NestInterceptor {
  private logger = new Logger('gateway');

  constructor(private readonly configService: ConfigService) {}

  get ms() {
    return +this.configService.get('API_GATEWAY_TIMEOUT', 5000);
  }

  intercept(
    context: ExecutionContext,
    next: CallHandler<unknown>
  ): Observable<unknown> {
    const now = Date.now();

    const ctrl = snakeCase(context.getClass().name);
    const svc = ctrl.substring(0, ctrl.lastIndexOf('_'));
    const cmd = `${svc}_${snakeCase(context.getHandler().name)}` as SvcMessage;

    return next.handle().pipe(
      tap(() => this.logger.log(`${cmd} in ${Date.now() - now}ms`)),
      timeout(this.ms),
      catchError((err: SvcException | TimeoutError | HttpException) => {
        this.logger.error(cmd, JSON.stringify(err));

        if (err instanceof HttpException) {
          return throwError(() => err);
        }

        if (err instanceof TimeoutError) {
          return throwError(
            () =>
              new HttpException(SvcMessage.Timeout, HttpStatus.GATEWAY_TIMEOUT)
          );
        }

        return throwError(
          () =>
            new HttpException(err, err.status || HttpStatus.BAD_REQUEST)
        );
      })
    );
  }
}
