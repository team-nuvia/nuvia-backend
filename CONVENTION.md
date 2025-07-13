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
