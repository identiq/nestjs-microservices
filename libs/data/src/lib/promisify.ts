import { HttpStatus } from '@nestjs/common';
import { catchError, firstValueFrom, Observable, of, timeout } from 'rxjs';
import { ServiceMessage } from './message.enum';

export const timeoutify = ($observable: Observable<unknown>, ms = 5000) =>
  firstValueFrom(
    $observable.pipe(
      timeout(ms),
      catchError((error) =>
        of({
          statusCode: HttpStatus.GATEWAY_TIMEOUT,
          message: ServiceMessage.Timeout,
          error,
        })
      )
    )
  );
