import { CommonModule } from '@common/common.module';
import { CommonService } from '@common/common.service';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@users/entities/user.entity';
import { UserSecret } from '@users/user-secrets/entities/user-secret.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [CommonModule, PassportModule],
      inject: [CommonService],
      useExisting: CommonService, // ✅ 이 방식이 더 안전
      useFactory: (commonService: CommonService) => ({
        secret: commonService.getConfig('secret').jwt,
        verifyOptions: {
          issuer: 'custom',
          algorithms: ['HS256'],
        },
      }),
    }),
    TypeOrmModule.forFeature([User, UserSecret]),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
})
export class AuthModule {}
