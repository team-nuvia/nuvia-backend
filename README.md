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
- [ ] sharp

### 개발

- [x] @types/cookie-parser
- [x] tsconfig-paths
- [x] @types/compression
- [x] vitest
- [x] vite-tsconfig-paths
- [x] @types/multer
- [ ] @types/passport-local
- [ ] @types/passport-jwt
- [ ] @types/sharp
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
