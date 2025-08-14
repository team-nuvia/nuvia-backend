# NestJS + TypeORM 환경 Seed Template

NestJS + TypeORM 환경을 위한 환경설정입니다.

해당 템플릿은 다른 프로젝트의 기반으로 사용될 목적으로 제작됩니다.

SWC를 적용하여 보다 빠른 개발 환경을 구축합니다.

## 설치된 의존

### 운영

- [x] cookie-parser
- [x] compression
- [x] dayjs
- [x] @nestjs/config
- [x] class-validator
- [x] class-transformer
- [x] @nestjs/swagger
- [ ] @nestjs/passport
- [ ] passport
- [ ] passport-local
- [x] @nestjs/jwt
- [ ] passport-jwt
- [x] @faker-js/faker
- [ ] @nestjs/axios
- [ ] axios
- [x] bcrypt
- [x] @nestjs/schedule
- [ ] @nestjs/cache-manager
- [ ] cache-manager
- [x] jsonwebtoken
- [x] @nestjs/typeorm
- [x] typeorm
- [x] mysql2
- [x] typeorm-extension
- [x] sharp
- [x] image-size

### 개발

- [x] @types/cookie-parser
- [x] tsconfig-paths
- [x] @types/compression
- [x] vitest
- [x] vite-tsconfig-paths
- [x] @types/multer
- [ ] @types/passport-local
- [ ] @types/passport-jwt
- [x] @types/sharp
- [ ] @compodoc/compodoc

## 필수 의존 설치

```bash
npm i cookie-parser compression dayjs @nestjs/config class-validator class-transformer @nestjs/swagger

npm i -D @types/cookie-parser tsconfig-paths @types/compression

npm i -D vitest vite-tsconfig-paths vitest

npm i -D @types/multer # 파일 업로드 / 응답 시 Buffer.from으로 감싸야 이미지 정상 응답

npm install --save @nestjs/passport passport passport-local # 보안 (로그인)
npm install --save-dev @types/passport-local

npm install --save @nestjs/jwt passport-jwt # jwt
npm install --save-dev @types/passport-jwt
```

### 선택 의존 설치

```bash
npm -D i @faker-js/faker # faker
npm i @nestjs/axios axios
npm i bcrypt # 보안 - 비밀번호 암호화
npm i @nestjs/event-emitter # 이벤트 기반
npm i compression # 압축
npm i @nestjs/schedule # 스케쥴러
npm i @nestjs/cache-manager cache-manager # 캐싱
npm i @nestjs/throttler # 쓰로틀링
npm i @nestjs/websockets @nestjs/platform-socket.io # 웹소켓
npm i amqplib amqp-connection-manager # RabbitMQ 메세징
npm i @nestjs-modules/ioredis ioredis # Redis

npm i express-session
npm i -D @types/express-session

npm i jsonwebtoken # JWT
npm i -D @types/jsonwebtoken

npm i sharp # 이미지 상세 처리
npm i image-size # 이미지 크기 처리
npm i -D @types/sharp

# TypeORM (최근 데이터 손실 문제 등으로 비전에 대해 말이 많음)
npm install --save @nestjs/typeorm typeorm mysql2 typeorm-naming-strategies
npm install typeorm-extension --save # seeding 도구

npm i -D @compodoc/compodoc # Nestjs 프로젝트 문서화 빌드
# npx @compodoc/compodoc -p tsconfig.json -s 생성
```

[Redis Installation](https://www.npmjs.com/package/@nestjs-modules/ioredis)

### SWC 설정

```bash
npm i --save-dev @swc/cli @swc/core
```

```bash
npm i --save-dev vitest unplugin-swc @swc/core @vitest/coverage-v8
```

## Vitest 실행 시 import 어쩌고 에러 뜰 때

원인은 typeorm에서 entities나 migrations 경로가 잘못되어서 그런거임

## Template Base Features

- [x] 전역 타입 지정
  - [x] 공통 타입 작성
- [x] 테스트 환경 구축
  - [x] E2E 종단간 테스트 초안 작성
- [ ] 환경변수
  - [ ] 공통
    - [x] 서버 버저닝
    - [x] api prefix
    - [x] 서버 정보
    - [ ] 로그
      - [x] 레벨
      - [x] 활성화
      - [ ] 저장 활성화
      - [x] 로그 저장 경로
      - [x] 로그 확장자
  - [x] 개발용
    - [x] 데이터베이스
    - [x] 비밀키
  - [x] 운영용
    - [x] 데이터베이스
    - [x] 비밀키
- [x] 데이터베이스 연동
  - [x] TypeORM 연동
    - [x] 옵션 설정
    - [x] DataSource 설정
- [ ] 필수 미들웨어 개발
  - [ ] 로거
    - [x] 시스템 로그
    - [ ] 로그 파일 저장
  - [x] 검증
    - [x] JWT 토큰
    - [x] 사용자 권한
  - [x] 파싱
    - [x] Authorization 헤더 JWT 토큰
  - [x] 데코레이터
    - [x] 권한 검증
  - [x] 가드
    - [x] 로그인 요구
    - [x] 공개 처리
  - [x] 필터
    - [x] 공통 예외처리 필터 개발
  - [x] 스웨거
    - [x] 스웨거 초안 작성
    - [x] ok response 스키마 제작
    - [x] error response 스키마 제작작
- [ ] ORM 처리
  - [x] 예외 처리
  - [ ] 트랜젝션 처리 (2가지 이상 CUD 사용 시)

## TODO

- 2025-08-07 00:28:58
  - [x] 설문 수정 기능
  - [x] 대시보드 메타데이터 조회 API
  - [x] 설문 목록 조회 API
  - [ ] 구독, 권한, 구독의 개인/기업 유형, 개별/단체 구독 및 권한 관리 프로세스 수립
    - [x] 구독 및 권한 관계 정리
  - [ ] 설문 추가,수정,삭제 권한 검증
    - [ ] 검증 로직 별도 분리 (재사용성 고려)
