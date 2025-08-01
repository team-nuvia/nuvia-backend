import { BaseRepository } from '@common/base.repository';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@users/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthRepository extends BaseRepository<User> {
  constructor(
    @InjectRepository(User)
    protected readonly userRepository: Repository<User>,
  ) {
    super(userRepository);
  }

  findUserWithSecret(email: string) {
    return this.userRepository.findOne({
      where: { email },
      relations: { userSecret: true },
      select: { userSecret: { salt: true, password: true, iteration: true } },
    });
  }
}
