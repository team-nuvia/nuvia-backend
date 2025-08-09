import { OrganizationRole } from '@/organizations/organization-roles/entities/organization-role.entity';
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

  async findUserById(id: number): Promise<LoginUserData> {
    const user = await this.orm
      .getRepo(User)
      .createQueryBuilder('u')
      .leftJoinAndSelect('u.subscription', 'usb')
      .leftJoinAndSelect('usb.organization', 'uo')
      .leftJoinAndMapOne('uo.organizationRole', OrganizationRole, 'uor', 'uor.organizationId = uo.id AND uor.userId = u.id')
      .leftJoinAndMapOne('u.permission', Permission, 'p', 'p.id = uor.permissionId AND uor.organizationId = uo.id AND uor.userId = u.id')
      .where('u.id = :id', { id })
      .select(['u.id', 'u.email', 'u.name', 'u.nickname', 'p.role'])
      .getOne();

    if (isNil(user)) {
      throw new NotFoundUserExceptionDto(id.toString());
    }

    const permission = (user as User & { permission: Permission }).permission;

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      nickname: user.nickname,
      role: permission.role,
    };
  }

  async findUserWithSecret(email: string) {
    const user = await this.orm
      .getRepo(User)
      .createQueryBuilder('u')
      .where('u.email = :email', { email })
      .leftJoinAndSelect('u.userSecret', 'us')
      .leftJoinAndSelect('u.subscription', 'usb')
      .leftJoinAndSelect('usb.organization', 'uo')
      .leftJoinAndMapOne('u.organizationRole', OrganizationRole, 'uor', 'uor.userId = u.id AND uor.organizationId = uo.id')
      .leftJoinAndMapOne('u.permission', Permission, 'up', 'up.id = uor.permissionId')
      .select([
        'u.id',
        'u.email',
        'u.name',
        'u.nickname',
        'us.id',
        'us.salt',
        'us.password',
        'us.iteration',
        'usb.id',
        'uo.id',
        'uor.id',
        'uor.userId',
        'uor.organizationId',
        'uor.permissionId',
        'up.id',
        'up.role',
      ])
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
