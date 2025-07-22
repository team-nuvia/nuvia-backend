import { NoMatchUserInformationException } from '@common/dto/exception/no-match-user-info.exception.dto';
import { NotFoundUserException } from '@common/dto/exception/not-found-user.exception.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@users/entities/user.entity';
import { isNil } from '@util/isNil';
import { UtilService } from '@util/util.service';
import { Repository } from 'typeorm';
import { LoginTokenNestedResponseDto } from './dto/response/login-token.nested.response.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly utilService: UtilService,
  ) {}

  async login(payload: LoginUserData): Promise<LoginTokenNestedResponseDto> {
    // const user = await this.userRepository.findOne({
    //   where: { email },
    //   relations: { userSecret: true },
    //   select: {
    //     userSecret: {
    //       salt: true,
    //       password: true,
    //       iteration: true,
    //     },
    //   },
    // });

    // console.log('🚀 ~ AuthService ~ user:', user);
    // if (isNil(user)) {
    //   throw new NotFoundUserException(email);
    // }

    // const payload: LoginUserData = {
    //   id: user.id,
    //   email: user.email,
    //   username: user.username,
    //   nickname: user.nickname,
    //   role: user.role,
    // };
    // const isSame = this.utilService.verifyPassword(password, {
    //   iteration: user.userSecret.iteration,
    //   salt: user.userSecret.salt,
    //   password: user.userSecret.password,
    // });

    // if (!isSame) {
    //   throw new NoMatchUserInformationException();
    // }

    // const payload: LoginUserData = {
    //   id: user.id,
    //   email: user.email,
    //   username: user.username,
    //   nickname: user.nickname,
    //   role: user.role,
    // };

    return this.utilService.createJWT(payload);
  }

  verifyToken(token: string) {
    return this.utilService.verifyJWT(token);
  }

  async validateUser(email: string, password: string) {
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
      throw new NotFoundUserException(email);
    }

    const isSame = this.utilService.verifyPassword(password, {
      iteration: user.userSecret.iteration,
      salt: user.userSecret.salt,
      password: user.userSecret.password,
    });

    if (!isSame) {
      throw new NoMatchUserInformationException();
    }

    return user;
  }
}
