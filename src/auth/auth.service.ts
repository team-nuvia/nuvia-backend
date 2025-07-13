import { BodyLoginDto } from '@common/dto/body/body-login.dto';
import { PayloadLoginTokenDto } from '@common/dto/payload/payload-login-token.dto';
import { NotFoundUserException } from '@common/dto/exception/not-found-user.exception';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@users/entities/user.entity';
import { NoMatchUserInformationException } from '@common/dto/exception/no-match-user-info.exception';
import { isNil } from '@util/isNil';
import { UtilService } from '@util/util.service';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly utilService: UtilService,
  ) {}

  async login({
    email,
    password,
  }: BodyLoginDto): Promise<PayloadLoginTokenDto> {
    const user = await this.userRepository.findOne({
      where: { email },
      relations: { userSecret: true },
      select: {
        userSecret: {
          salt: true,
          password: true,
          iteration: true,
        },
      },
    });

    console.log('🚀 ~ AuthService ~ user:', user);
    if (isNil(user)) {
      throw new NotFoundUserException(email);
    }

    const payload: LoginUserData = {
      id: user.id,
      email: user.email,
      username: user.username,
      nickname: user.nickname,
      role: user.role,
    };
    const isSame = this.utilService.verifyPassword(password, {
      iteration: user.userSecret.iteration,
      salt: user.userSecret.salt,
      password: user.userSecret.password,
    });

    if (!isSame) {
      throw new NoMatchUserInformationException();
    }

    return this.utilService.createJWT(payload);
  }

  verifyToken(token: string) {
    return this.utilService.verifyJWT(token);
  }
}
