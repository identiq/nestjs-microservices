import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import {
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
  PrismaClientValidationError,
} from '@prisma/client/runtime';
import { PrismaError } from 'prisma-error-enum';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { SvcException, SvcMessage } from '..';
import { snakeCase } from './utils';

@Injectable()
export class PrismaInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const now = Date.now();

    const ctrl = snakeCase(context.getClass().name);
    const svc = ctrl.substring(0, ctrl.lastIndexOf('_'));
    const cmd = `${svc}_${snakeCase(context.getHandler().name)}` as SvcMessage;
    const logger = new Logger(svc);

    return next.handle().pipe(
      tap(() => logger.log(`${cmd} in ${Date.now() - now}ms`)),
      catchError(
        (
          error:
            | PrismaClientKnownRequestError
            | PrismaClientUnknownRequestError
            | PrismaClientValidationError
            | SvcException
        ) => {
          logger.error(cmd, JSON.stringify(error));

          if (error instanceof SvcException) {
            return throwError(() => error);
          }

          if (
            error instanceof PrismaClientKnownRequestError &&
            error.code === PrismaError.UniqueConstraintViolation
          ) {
            return throwError(
              () =>
                new SvcException({
                  status: HttpStatus.CONFLICT,
                  message: `${cmd}_${SvcMessage[HttpStatus.CONFLICT]}`,
                })
            );
          }

          return throwError(
            () =>
              new SvcException({
                status: HttpStatus.BAD_REQUEST,
                message: `${cmd}_${SvcMessage[HttpStatus.BAD_REQUEST]}`,
              })
          );
        }
      )
    );
  }
}
