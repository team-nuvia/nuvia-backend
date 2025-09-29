import { ForbiddenAccessExceptionDto } from '@common/dto/exception/forbidden-access.exception.dto';
import { NoRoleInformationExceptionDto } from '@common/dto/exception/no-role-information.exception.dto';
import { UnauthorizedException } from '@common/dto/response';
import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiCookieAuth } from '@nestjs/swagger';
import { CombineResponses } from './combine-responses.decorator';

export const RequiredLogin = applyDecorators(
  ApiCookieAuth(),
  CombineResponses(HttpStatus.UNAUTHORIZED, UnauthorizedException, ForbiddenAccessExceptionDto, NoRoleInformationExceptionDto),
);
