import { BadRequest, NotFound } from '@common/dto/exception-response.dto';
import { LoginTokenDto } from '@common/dto/dsl-login';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@users/entities/user.entity';
import { isNil } from '@util/isNil';
import { UtilService } from '@util/util.service';
import { Repository } from 'typeorm';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly utilService: UtilService,
  ) {}

  async login({ email, password }: LoginDto): Promise<LoginTokenDto> {
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

    if (isNil(user)) {
      throw new NotFound('해당 이메일을 찾을 수 없습니다.', email);
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
      throw new BadRequest('정보를 다시 확인 해주세요.');
    }

    return this.utilService.createJWT(payload);
  }

  verifyToken(token: string) {
    return this.utilService.verifyJWT(token);
  }
}
