import { Injectable } from '@nestjs/common';
import { ChangePasswordDto } from './dto/change-password.tto';
import { CreateAuthDto } from './dto/create-auth.dto';
import crypto from 'crypto';

@Injectable()
export class AuthService {
  hashPassword(password: string) {
    const salt = crypto.randomBytes(64).toString('base64');
    const min = 50_000;
    const max = 100_000;
    /* min ~ max 범위 */
    const iteration = Math.floor(Math.random() * (max - min + 1)) + min;

    const keyLength = 64;
    const digest = 'sha512';

    const hashedPassword = crypto
      .pbkdf2Sync(password, salt, iteration, keyLength, digest)
      .toString('base64');

    return {
      salt,
      iteration,
      hashedPassword: `${salt}:${hashedPassword}`,
    };
  }

  verifyToken() {
    throw new Error('Method not implemented.');
  }
  sendVerificationEmail(email: string) {
    throw new Error('Method not implemented.');
  }
  changePassword(changePasswordDto: ChangePasswordDto) {
    throw new Error('Method not implemented.');
  }
  create(createAuthDto: CreateAuthDto) {
    return 'This action adds a new auth';
  }
}
