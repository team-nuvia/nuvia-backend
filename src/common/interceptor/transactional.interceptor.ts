import { TX_META_KEY } from '@common/decorator/transactional.decorator';
import { TxRunner } from '@database/tx.runner';
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { from, lastValueFrom, Observable } from 'rxjs';

@Injectable()
export class TransactionalInterceptor implements NestInterceptor {
  constructor(
    private readonly tx: TxRunner,
    private readonly reflector: Reflector,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const isTx = this.reflector.getAllAndOverride<boolean>(TX_META_KEY, [context.getHandler(), context.getClass()]);
    console.log('🚀 ~ TransactionalInterceptor ~ intercept ~ isTx:', isTx);

    if (!isTx) {
      return next.handle();
    }

    return from(this.tx.run(() => lastValueFrom(next.handle())));
  }
}
