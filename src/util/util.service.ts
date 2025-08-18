import { CommonService } from '@common/common.service';
import { LoggerService } from '@logger/logger.service';
import { Injectable } from '@nestjs/common';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { VerifySecretDto } from './dto/payload/verify-secret.dto';
import { VerifySurveyJWSPayloadDto } from './dto/payload/verify-survey-jws.payload.dto';

@Injectable()
export class UtilService {
  constructor(
    private readonly loggerService: LoggerService,
    private readonly commonService: CommonService,
  ) {}

  verifyPassword(inputPassword: string, verifyContent: VerifySecretDto) {
    const storedPassword = verifyContent.password;
    const { hashedPassword } = this.hashPassword(inputPassword, verifyContent.salt, verifyContent.iteration);
    return hashedPassword === storedPassword;
  }

  hashPassword(password: string, salt?: string, iteration?: number) {
    if (!salt) {
      salt = crypto.randomBytes(64).toString('base64');
    }
    if (!iteration) {
      const min = 50_000;
      const max = 100_000;
      /* min ~ max 범위 */
      iteration = Math.floor(Math.random() * (max - min + 1)) + min;
    }
    const keyLength = 64;
    const digest = 'sha512';

    const hashedPassword = crypto.pbkdf2Sync(password, salt, iteration, keyLength, digest).toString('base64');

    return {
      salt,
      iteration,
      hashedPassword: `${salt}:${hashedPassword}`,
    };
  }

  // 설문 식별 해시토큰
  // base64 token
  createHash(data: string) {
    return crypto.createHash('sha256').update(data).digest('base64');
  }

  // 설문 인증 JWS
  createSurveyJWS(data: VerifySurveyJWSPayloadDto) {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    const kid = `${year}-${month}-${day}`;
    const alg = 'HS256';

    const secretConfig = this.commonService.getConfig('secret');
    const jws = jwt.sign(data, secretConfig.answerJwt, {
      expiresIn: secretConfig.tokenExpireTime,
      algorithm: alg,
      // KID(Key ID)는 여러 키를 관리할 때 어떤 키로 서명했는지 식별하는 용도
      // 날짜를 포함하여 키 로테이션을 명시적으로 표현
      // 보안상 이점: 정기적인 키 교체로 키 노출 위험 최소화
      // 예: 월별 또는 분기별로 키를 교체하여 보안 강화

      // alg(Algorithm): JWT 헤더에서 사용되는 서명 알고리즘을 지정
      // HS256: HMAC SHA-256 대칭키 암호화 알고리즘
      // - HMAC: Hash-based Message Authentication Code
      // - SHA-256: Secure Hash Algorithm 256-bit
      // - 대칭키 방식으로 같은 비밀키로 서명 생성 및 검증
      // - 빠른 성능과 간단한 구현이 장점
      // - 서버에서만 토큰을 검증할 때 적합
      header: { kid, alg },
    });
    return jws;
  }

  verifySurveyJWS(jws: string): boolean {
    try {
      const secretConfig = this.commonService.getConfig('secret');
      const decoded = jwt.verify(jws, secretConfig.answerJwt, { algorithms: ['HS256'] });
      return !!decoded;
    } catch (error) {
      return false;
    }
  }

  createJWT(payload: LoginUserData) {
    const secretConfig = this.commonService.getConfig('secret');
    const accessToken = jwt.sign(payload, secretConfig.jwt, {
      expiresIn: secretConfig.tokenExpireTime,
    });
    const refreshToken = jwt.sign(payload, secretConfig.jwt, {
      expiresIn: secretConfig.refreshExpireTime,
    });
    return { accessToken, refreshToken };
  }

  async refreshJWT(refreshToken: LoginUserData) {
    return this.createJWT(refreshToken);
  }

  decodeJWT(token: string) {
    return jwt.decode(token, { json: true }) as LoginUserData;
  }

  verifyJWT(token: string) {
    const secretConfig = this.commonService.getConfig('secret');
    try {
      const decodedToken = jwt.verify(token, secretConfig.jwt);
      return Boolean(decodedToken);
    } catch (error) {
      this.loggerService.debug(error);
      return false;
    }
  }
}
