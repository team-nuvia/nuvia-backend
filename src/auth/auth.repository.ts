import { Organization } from '@/organizations/entities/organization.entity';
import { Permission } from '@/organizations/permissions/entities/permission.entity';
import { BaseRepository } from '@common/base.repository';
import { NotFoundUserExceptionDto } from '@common/dto/exception/not-found-user.exception.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@users/entities/user.entity';
import { isNil } from '@util/isNil';
import { Repository } from 'typeorm';

@Injectable()
export class AuthRepository extends BaseRepository<User> {
  constructor(
    @InjectRepository(User)
    protected readonly userRepository: Repository<User>,
  ) {
    super(userRepository);
  }

  async findUserWithSecret(email: string) {
    const user = await this.userRepository
      .createQueryBuilder('u')
      .where('u.email = :email', { email })
      .leftJoinAndSelect('u.userSecret', 'us')
      .leftJoinAndSelect('u.subscription', 'usb')
      .leftJoinAndSelect('usb.organization', 'uo')
      .leftJoinAndMapOne('uo.permission', Permission, 'up', 'up.userId = u.id AND up.subscriptionId = usb.id')
      .select(['u.id', 'u.email', 'us.salt', 'us.password', 'us.iteration', 'up.id', 'up.role'])
      .getOne();

    if (isNil(user) || isNil(user.userSecret)) {
      throw new NotFoundUserExceptionDto(email);
    }

    const permission = (user.subscription.organization as Organization & { permission: Permission }).permission;

    const combinedUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      nickname: user.nickname,
      role: permission.role,
      userSecret: user.userSecret,
    };
    return combinedUser;
  }
}
