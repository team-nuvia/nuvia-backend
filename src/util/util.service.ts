import { CommonService } from '@common/common.service';
import { LoggerService } from '@logger/logger.service';
import { Injectable } from '@nestjs/common';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { VerifySecretDto } from './dto/verify-secret.dto';

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
