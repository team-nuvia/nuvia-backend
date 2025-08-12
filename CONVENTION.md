# 프로젝트 파일 구조

## 공통

- 공통
  - dto: 디렉토리
  - exception: 디렉토리
  - filter: 디렉토리
  - interceptor: 디렉토리
  - pipe: 디렉토리
  - service: 디렉토리
  - utils: 디렉토리
  - validator: 디렉토리
  - middleware: 디렉토리
  - guard: 디렉토리
- 설정
  - config: 디렉토리
- 유틸
  - 단일 파일

## 필수

- Domain
  - controller
  - service
  - dto
  - entities

## 커스텀

- Domain
  - repository
  - exception
  - response
  - form(or payload): 둘 중 하나만 택해서 통일한다.

## 네이밍 컨벤션

- 폴더명과 파일명은 소문자와 하이픈(-)으로 구성한다.
- 파일명은 도메인명, 구분명, 확장자로 작성하고 구분자는 "."으로 한다.
  - ex) `user.controller.ts`
- 유틸 함수는 카멜케이스로 작성한다.
  - ex) `getUser.ts`

## 책임

- controller: 요청 처리
- service: 비즈니스 로직 처리
- repository: 데이터베이스 처리
- dto: 데이터 전송 객체
- entities: 데이터베이스 엔티티
- exception: 예외 처리
- response: 응답 처리
- form(or payload): 둘 중 하나만 택해서 통일한다.

## 데코레이터 사용 규칙

- param: 파라미터 데코레이터
- payload: 페이로드 데코레이터
- response: 응답 데코레이터 (응답 형식 정의)
- exception: 예외 데코레이터 (예외 처리)

### 신규 모델 추가 규칙

- 모델 파일 생성 시 항상 파일 확장자를 포함한다.
  - ex) `get-user-accesses.response.dto.ts`
- 모델 파일 생성 시 항상 파일명은 모델명 + 확장자 이다.
  - ex) `get-user-accesses.response.dto.ts`
- 모델 파일 생성 시 멤버 변수 중 enum 타입은 반드시 ApiProperty에 enum 속성을 추가한다.
  - enum을 추가하지 않으면 swagger-ui의 에러 원인이 된다.
  - ex) `@ApiProperty({ enum: PermissionGrantType, description: '권한 제약사항 유형', example: PermissionGrantType.TeamInvite })`
- 모델 파일 생성 시 멤버 변수 중 날짜 타입은 반드시 기본값으로 현재 날짜를 추가한다.
  - ex) `lastAccessAt: Date | null = new Date('2021-01-01T00:00:00Z');`

#### Param

- 항상 Model의 파일 extension은 .param.dto.ts 이다.
- 항상 파일명은 모델명 + ParamDto 이다.

param은 파라미터를 위한 모델이다.

```typescript
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

/* 파라미터 모델의 경우 default 값 없이 정의한다. (Payload도 마찬가지) */
export class SearchQueryParamDto {
  /* ApiProperty와 class-validator만 사용한다. */
  /* Payload와 달리 모든 멤버 변수는 필수 값이 아니라 선택 값이다. */
  /* 단, 경우에 따라 필수가 되어야 한다. */
  @ApiProperty({
    description: '검색어',
    required: false,
  })
  @IsOptional()
  @IsString()
  search!: string;

  @ApiProperty({
    description: '페이지',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  page: number = 1;

  @ApiProperty({
    description: '페이지 크기',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(5)
  @Max(20)
  limit: number = 10;
}
```

#### Payload

- 항상 Model의 파일 extension은 .payload.dto.ts 이다.
- 항상 파일명은 모델명 + PayloadDto 이다.

payload는 요청 페이로드를 위한 모델이다.

```typescript
import { fakerKO as faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsStrongPassword } from 'class-validator';

/* Payload 모델의 경우 default 값 없이 정의한다. */
export class CreateUserPayloadDto {
  /* ApiProperty와 class-validator만 사용한다. */
  @ApiProperty({
    description: '이메일',
    example: faker.internet.email({
      firstName: 'lowfi',
      lastName: 'awesome',
      provider: 'example.com',
    }),
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    description: '이름',
    example: faker.person.fullName(),
  })
  @IsString()
  name!: string;

  @ApiProperty({
    description: '최소 5자 이상, 숫자, 대/소문자, 특수문자 1개씩 포함되어야 합니다.',
    example: 'qweQQ!!1',
  })
  @IsStrongPassword({
    minLength: 5,
    minNumbers: 1,
    minLowercase: 1,
    minSymbols: 1,
    minUppercase: 1,
  })
  @IsString()
  password!: string;
}
```

#### Exception

- 항상 Model의 파일 extension은 .exception.dto.ts 이다.
- 항상 파일명은 모델명 + ExceptionDto 이다.

exception은 예외 처리를 위한 모델이다.

```typescript
import { ErrorKey, ErrorMessage } from '@common/dto/response';
import { NotFoundException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class NotFoundOrganizationExceptionDto extends NotFoundException {
  /* 메시지는 기본 값을 정의한다. */
  @ApiProperty({
    example: ErrorMessage.NOT_FOUND_ORGANIZATION,
  })
  declare message: string;

  /* 생성자에서 예외 코드와 메시지를 정의한다. */
  /* 생성자에서는 ErrorKey, 멤버 변수에서는 ErrorMessage를 사용한다. */
  constructor(reason: StringOrNull = null) {
    super({ code: ErrorKey.NOT_FOUND_ORGANIZATION, reason });
  }
}
```

#### Response

- 항상 Model의 파일 extension은 .response.dto.ts 이다.
- 항상 파일명은 모델명 + ResponseDto 이다.

```typescript
import { ErrorMessage, GetResponse } from '@common/dto/response';
import { ApiProperty } from '@nestjs/swagger';
import { UserAccess } from '@users/user-accesses/entities/user-access.entity';

export class GetAllUserAccesseListResponseDto extends GetResponse<UserAccess[]> {
  /* 메시지는 기본 값을 정의한다. */
  @ApiProperty({ description: '메시지', example: ErrorMessage.SUCCESS_GET_USER_ACCESS_LIST })
  message: string = ErrorMessage.SUCCESS_GET_USER_ACCESS_LIST;

  /* 데이터는 타입만 정의한다. */
  @ApiProperty({ description: '데이터', type: () => UserAccess, isArray: true })
  declare payload: UserAccess[];

  /* 생성자에서 payload의 기본 값을 정의한다. */
  constructor(payload: UserAccess[] = [new UserAccess()]) {
    super(payload);
    this.payload = payload;
  }
}
```

### 사용 예시

```typescript
@Get(':id')
@CombineResponses(HttpStatus.OK, GetAllUserAccesseListResponseDto)
```

```typescript
@Get(':id')
@CombineResponses(HttpStatus.OK, GetAllUserAccesseListResponseDto)
```
