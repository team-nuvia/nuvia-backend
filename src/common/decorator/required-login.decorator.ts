import { ForbiddenAccessExceptionDto } from '@common/dto/exception/forbidden-access.exception.dto';
import { NoRoleInformationExceptionDto } from '@common/dto/exception/no-role-information.exception.dto';
import { UnauthorizedException } from '@common/dto/response';
import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CombineResponses } from './combine-responses.decorator';

// export class RequiredLoginConstraint implements CanActivate {
//   constructor(
//     @Inject(Reflector)
//     private readonly reflector: Reflector,
//     @Inject(UtilService)
//     private readonly utilService: UtilService,
//     @Inject(LoggerService)
//     private readonly loggerService: LoggerService,
//   ) {}

//   canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
//     const isPublic = this.reflector.getAllAndOverride<boolean>(PUBLIC_KEY, [context.getHandler(), context.getClass()]);

//     if (isPublic) {
//       return true;
//     }

//     const http = context.switchToHttp();
//     const request = http.getRequest<Request>();
//     const bearerToken = request.headers.authorization;

//     if (!bearerToken || !bearerToken?.startsWith('Bearer')) {
//       throw new UnauthorizedException();
//     }

//     const token = bearerToken.slice(7);
//     try {
//       const isVerified = this.utilService.verifyJWT(token);
//       return isVerified;
//     } catch (error) {
//       this.loggerService.debug(`JWT 검증 에러 ${error}`);
//       return false;
//     }
//   }
// }

export const RequiredLogin = applyDecorators(
  ApiBearerAuth(),
  /* UseGuards(RequiredLoginConstraint), */ CombineResponses(
    HttpStatus.UNAUTHORIZED,
    UnauthorizedException,
    ForbiddenAccessExceptionDto,
    NoRoleInformationExceptionDto,
  ),
);
