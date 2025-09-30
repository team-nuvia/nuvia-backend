import { PlanGrantConstraintsType } from '@/plans/enums/plan-grant-constraints-type.enum';
import { AlreadyJoinedUserExceptionDto } from '@/subscriptions/dto/exception/already-joined-user.exception.dto';
import { NotFoundSubscriptionExceptionDto } from '@/subscriptions/dto/exception/not-found-subscription.exception.dto';
import { Subscription } from '@/subscriptions/entities/subscription.entity';
import { ExpiredInvitationTokenExceptionDto } from '@auth/dto/exception/expired-invitation-token.exception.dto';
import { CommonService } from '@common/common.service';
import { NotFoundUserExceptionDto } from '@common/dto/exception/not-found-user.exception.dto';
import { COOKIE_SESSION_EXPIRE_TIME } from '@common/variable/globals';
import { LoggerService } from '@logger/logger.service';
import { Injectable } from '@nestjs/common';
import { OrganizationRoleStatusType } from '@share/enums/organization-role-status-type';
import { User } from '@users/entities/user.entity';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { ExceededTeamLimitExceptionDto } from './dto/exception/exceeded-team-limit.exception.dto';
import { FailDecodeTokenExceptionDto } from './dto/exception/fail-decode-token.exception.dto';
import { FailEncodeTokenExceptionDto } from './dto/exception/fail-encode-token.exception.dto';
import { InvalidTokenLengthExceptionDto } from './dto/exception/invalid-token-length.exception.dto';
import { VerifyInvitationTokenNestedPayloadDto } from './dto/payload/verify-invitation-token.nested.payload.dto';
import { VerifySecretPayloadDto } from './dto/payload/verify-secret.payload.dto';
import { VerifySurveyJWSPayloadDto } from './dto/payload/verify-survey-jws.payload.dto';
import { isNil } from './isNil';
import { UtilRepository } from './util.repository';

@Injectable()
export class UtilService {
  constructor(
    private readonly loggerService: LoggerService,
    private readonly commonService: CommonService,
    private readonly utilRepository: UtilRepository,
  ) {}

  verifyPassword(inputPassword: string, verifyContent: VerifySecretPayloadDto) {
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

  /**
   * 해시토큰 생성
   * @param data 해시토큰 생성 데이터
   * @returns 해시토큰
   */
  createHash(data: string) {
    return crypto.createHash('sha256').update(data).digest('base64');
  }

  private sign(data: string) {
    const secretConfig = this.commonService.getConfig('secret');
    return crypto.createHmac('sha256', secretConfig.session).update(data).digest('base64url');
  }

  /* hmac session 생성 */
  createHmacSession(payload: LoginUserData, ttlSec: number = COOKIE_SESSION_EXPIRE_TIME) {
    const secretConfig = this.commonService.getConfig('secret');

    const now = Math.floor(Date.now() / 1000);
    const sessionPayload = {
      sub_hash: crypto.createHmac('sha256', secretConfig.session).update(payload.id.toString()).digest('base64url'),
      iat: now + ttlSec,
      exp: now + secretConfig.cookieSessionExpireTime,
      ver: 1,
    };

    const b64 = Buffer.from(JSON.stringify(sessionPayload)).toString('base64url');
    const sig = this.sign(b64);
    const session = `${b64}.${sig}`;
    return session;
  }

  /* hmac session 검증 */
  verifyHmacSession(session: string): string | null {
    if (!session) return null;

    const [b64, sig] = session.split('.');
    if (!b64 || !sig) return null;

    const expected = this.sign(b64);
    if (crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected)) === false) return null;

    const payload = JSON.parse(Buffer.from(b64, 'base64url').toString('utf8'));
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;

    return payload;
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
      expiresIn: secretConfig.answerJwtExpireTime,
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

  verifySurveyJWS(jws: string): void {
    const secretConfig = this.commonService.getConfig('secret');
    jwt.verify(jws, secretConfig.answerJwt, { algorithms: ['HS256'] });
  }

  createJWT(payload: LoginUserData) {
    const secretConfig = this.commonService.getConfig('secret');
    const accessToken = jwt.sign(payload, secretConfig.jwt, {
      expiresIn: secretConfig.jwtTokenExpireTime,
    });
    const refreshToken = jwt.sign(payload, secretConfig.jwt, {
      expiresIn: secretConfig.jwtRefreshExpireTime,
    });
    return { accessToken, refreshToken };
  }

  // async createServerSideSession(payload: LoginUserData) {
  //   const secretConfig = this.commonService.getConfig('secret');
  //   const user = await this.utilRepository.getBy({ id: payload.id }, User);

  //   if (!user) {
  //     throw new NotFoundUserExceptionDto();
  //   }

  //   const session = jwt.sign(payload, secretConfig.session, {
  //     expiresIn: secretConfig.cookieSessionExpireTime,
  //   });
  //   return session;
  // }

  refreshJWT(refreshToken: LoginUserData) {
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

  encodeToken(data: string): string {
    try {
      this.loggerService.debug(`🚀 ~ 암호화 데이터: ${data}`);

      const secretConfig = this.commonService.getConfig('secret');
      const key = crypto.scryptSync(secretConfig.encrypt, secretConfig.encryptSalt, 32);
      const iv = crypto.randomBytes(16);
      const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);

      const encrypted = Buffer.concat([cipher.update(data, 'utf8'), cipher.final()]);

      // IV와 암호화된 데이터를 함께 base64로 인코딩
      return Buffer.concat([iv, encrypted]).toString('base64url');
    } catch (error: any) {
      this.loggerService.error(`토큰 암호화 실패: ${error.message}`);
      throw new FailEncodeTokenExceptionDto();
    }
  }

  decodeToken(token: string): string {
    try {
      const secretConfig = this.commonService.getConfig('secret');
      const key = crypto.scryptSync(secretConfig.encrypt, secretConfig.encryptSalt, 32);

      const encoding: BufferEncoding = token.includes('-') || token.includes('_') ? 'base64url' : 'base64';

      // base64 디코딩
      const combined = Buffer.from(token, encoding);
      if (combined.length < 17) throw new InvalidTokenLengthExceptionDto();

      // IV 추출 (처음 16바이트)
      const iv = combined.subarray(0, 16);

      // 암호화된 데이터 추출 (16바이트 이후)
      const encrypted = combined.subarray(16);

      // 복호화
      const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
      const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);

      return decrypted.toString('utf8');
    } catch (error: any) {
      this.loggerService.error(`토큰 복호화 실패: ${error.message}`);
      throw new FailDecodeTokenExceptionDto();
    }
  }

  /**
   *
   * @param subscriptionId subscription id (구독 조직 id)
   * @param inviteeEmail invitee email (초대받는 유저 email)
   * @param inviterUserId inviter user id (초대하는 유저 id)
   * @returns invitation token (초대 토큰)
   */
  createInvitationToken(subscriptionId: number, inviteeEmail: string, inviterUserId: number): string {
    const invitationData = `${subscriptionId}:${inviteeEmail}:${inviterUserId}`;
    const encodedData = this.encodeToken(invitationData);
    const timestamp = `${encodedData}:${Date.now()}`;
    const token = this.encodeToken(timestamp);
    return token;
  }

  async parseInvitationToken(token: string): Promise<VerifyInvitationTokenNestedPayloadDto> {
    const decodedToken = this.decodeToken(token);
    const [encodedData, timestamp] = decodedToken.split(':');
    const invitationData = this.decodeToken(encodedData);
    const [subscriptionId, inviteeEmail, inviterUserId] = invitationData.split(':');

    /* 초대 토큰 만료 검증 */
    const isExpired = Date.now() - Number(timestamp) > 24 * 60 * 60 * 1000;
    if (isExpired) throw new ExpiredInvitationTokenExceptionDto();

    /* 조직 검증 */
    const isSubscription = await this.utilRepository.getByWith(
      { id: +subscriptionId },
      { plan: { planGrants: true }, organizationRoles: true },
      Subscription,
    );
    if (!isSubscription) throw new NotFoundSubscriptionExceptionDto();

    /* 팀 인원 제약 검증 */
    const planTeamInviteLimitConstraint = isSubscription.plan.planGrants.find(
      (planGrant) => planGrant.constraints === PlanGrantConstraintsType.TeamInvite && planGrant.isAllowed,
    );
    if (planTeamInviteLimitConstraint && !isNil(planTeamInviteLimitConstraint.amount)) {
      const joinedUserCount = isSubscription.organizationRoles.filter(
        (role) => role.status === OrganizationRoleStatusType.Joined && role.deletedAt === null,
      ).length;
      if (joinedUserCount >= planTeamInviteLimitConstraint.amount) throw new ExceededTeamLimitExceptionDto();
    }

    /* 초대 받는 유저 검증 */
    const isInvitee = await this.utilRepository.getBy({ userProviders: { email: inviteeEmail } }, User);
    if (!isInvitee) throw new NotFoundUserExceptionDto('invitee');

    /* 이미 조직에 가입한 유저 검증 */
    if (
      isSubscription.organizationRoles.some(
        (role) => role.userId === isInvitee.id && role.status === OrganizationRoleStatusType.Joined && role.deletedAt === null,
      )
    ) {
      throw new AlreadyJoinedUserExceptionDto();
    }

    /* 초대 하는 유저 검증 */
    const isInviter = await this.utilRepository.existsBy({ id: +inviterUserId }, User);
    if (!isInviter) throw new NotFoundUserExceptionDto('inviter');

    return { verified: true, subscriptionId: +subscriptionId, inviteeId: isInvitee.id };
  }
}
