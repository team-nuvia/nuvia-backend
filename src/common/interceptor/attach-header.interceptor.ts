import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';

/* 추후 글로벌 사용자 타임존 검증에 필요하기 때문에 보류 */
/*
  Controller에서 각 라우터 마다 UseInterceptors(AttachHeaderInterceptor)로 사용
  각 데코레이터 args.object에 headers에서 사용자 타임존 검증에 필요한 정보를 추가해서 사용
*/
@Injectable()
export class AttachHeaderInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest() as Request;
    if (request.body) {
      request.body.context = { headers: request.headers };
    }
    return next.handle();
  }
}
