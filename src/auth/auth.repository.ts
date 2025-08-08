import { Permission } from '@/permissions/entities/permission.entity';
import { BaseRepository } from '@common/base.repository';
import { NotFoundUserExceptionDto } from '@common/dto/exception/not-found-user.exception.dto';
import { Injectable } from '@nestjs/common';
import { User } from '@users/entities/user.entity';
import { isNil } from '@util/isNil';
import { OrmHelper } from '@util/orm.helper';

@Injectable()
export class AuthRepository extends BaseRepository {
  constructor(protected readonly orm: OrmHelper) {
    super(orm);
  }

  async findUserWithSecret(email: string) {
    const user = await this.orm
      .getRepo(User)
      .createQueryBuilder('u')
      .where('u.email = :email', { email })
      .leftJoinAndSelect('u.userSecret', 'us')
      .leftJoinAndSelect('u.subscription', 'usb')
      .leftJoinAndSelect('usb.organization', 'uo')
      .leftJoinAndMapOne('u.permission', Permission, 'up', 'up.userId = u.id AND up.organizationId = uo.id')
      .select(['u.id', 'u.email', 'us.salt', 'us.password', 'us.iteration', 'up.id', 'up.role'])
      .getOne();

    console.log('🚀 ~ AuthRepository ~ findUserWithSecret ~ user:', user);
    if (isNil(user) || isNil(user.userSecret)) {
      throw new NotFoundUserExceptionDto(email);
    }

    const permission = (user as User & { permission: Permission }).permission;
    console.log('🚀 ~ AuthRepository ~ findUserWithSecret ~ permission:', permission);

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
