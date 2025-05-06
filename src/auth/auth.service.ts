import { User } from '@/users/entities/user.entity';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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

  async login({ email, password }: LoginDto) {
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
      throw new NotFoundException(email);
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
      throw new BadRequestException();
    }
    return this.utilService.createJWT(payload);
  }

  verifyToken(token: string) {
    return this.utilService.verifyJWT(token);
  }
}
