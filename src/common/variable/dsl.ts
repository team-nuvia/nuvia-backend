import { SuccessLoginResponseDto } from '@common/dto/dsl-login';
import { NotFoundEmailResponseDto } from '@common/dto/dsl-notfound-email.dto';
import { NotFoundUserResponseDto } from '@common/dto/dsl-notfound-user.dto';
import { SuccessUserMeResponseDto } from '@common/dto/dsl-user-me';
import {
  BadRequestResponseDto,
  UnauthorizedResponseDto,
} from '@common/dto/global-response.dto';

export const ApiDocs = {
  DslLogin: SuccessLoginResponseDto,
  DslUserMe: SuccessUserMeResponseDto,
  DslNotFoundUser: NotFoundUserResponseDto,
  DslNotFoundEmail: NotFoundEmailResponseDto,
  DslBadRequest: BadRequestResponseDto,
  DslUnauthorized: UnauthorizedResponseDto,
} as const;
