import { NotFoundProfileImageDto } from '@/static/dto/not-found-profile-image.dto';
import { SuccessResponseGetProfileImageDto } from '@/static/dto/success-response-get-profile-image.dto';
import { SuccessResponseVerifyTokenDto } from '@auth/dto/success-response-verify-token.dto';
import {
  BadRequestResponseDto,
  UnauthorizedResponseDto,
} from '@common/dto/global-response.dto';
import { NotFoundResponseEmailDto } from '@common/dto/response/not-found-response-email.dto';
import { NotFoundResponseUserDto } from '@common/dto/response/not-found-response-user.dto';
import { SuccessResponseGetVersionDto } from '@common/dto/response/success-response-get-version.dto';
import { SuccessResponseLoginDto } from '@common/dto/response/success-response-login.dto';
import { SuccessResponseUserMeDto } from '@common/dto/response/success-response-user-me.dto';
import { SuccessResponseCreateUserDto } from '@user-secrets/dto/success-response-create-user.dto';
import { SuccessResponseUpdateUserSecretDto } from '@user-secrets/dto/success-response-update-user-secret.dto';
import { SuccessResponseUpdateUserDto } from '@users/dto/success-reesponse-update-user.dto';
import { SuccessResponseDeleteUserDto } from '@users/dto/success-response-delete-user.dto';
import { NotFoundResponseProfileDto } from '@users/profiles/dto/not-found-response-profile.dto';
import { SuccessResponseCreateProfileDto } from '@users/profiles/dto/success-response-create-profile.dto';
import { SuccessResponseDeleteProfileDto } from '@users/profiles/dto/success-response-delete-profile.dto';
import { SuccessResponseGetProfileDto } from '@users/profiles/dto/success-response-get-profile.dto';
import { SuccessResponseUpdateProfileDto } from '@users/profiles/dto/success-response-update-profile.dto';

/* 응답 객체 모음 */
export const ApiDocs = {
  DslGetVersion: SuccessResponseGetVersionDto,
  DslLogin: SuccessResponseLoginDto,
  DslUserMe: SuccessResponseUserMeDto,
  DslCreateUser: SuccessResponseCreateUserDto,
  DslUpdateUser: SuccessResponseUpdateUserDto,
  DslDeleteUser: SuccessResponseDeleteUserDto,
  DslUpdateUserSecret: SuccessResponseUpdateUserSecretDto,
  DslVerifyToken: SuccessResponseVerifyTokenDto,
  DslGetProfile: SuccessResponseGetProfileDto,
  DslCreateProfile: SuccessResponseCreateProfileDto,
  DslUpdateProfile: SuccessResponseUpdateProfileDto,
  DslDeleteProfile: SuccessResponseDeleteProfileDto,
  DslGetProfileImage: SuccessResponseGetProfileImageDto,
  DslNotFoundProfileImage: NotFoundProfileImageDto,
  DslNotFoundUser: NotFoundResponseUserDto,
  DslNotFoundEmail: NotFoundResponseEmailDto,
  DslNotFoundProfile: NotFoundResponseProfileDto,
  DslBadRequest: BadRequestResponseDto,
  DslUnauthorized: UnauthorizedResponseDto,
} as const;
