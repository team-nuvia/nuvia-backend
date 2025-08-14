import { Permission } from '@/permissions/entities/permission.entity';
import { OrganizationRole } from '@/subscriptions/organization-roles/entities/organization-role.entity';
import { BaseRepository } from '@common/base.repository';
import { NotFoundUserExceptionDto } from '@common/dto/exception/not-found-user.exception.dto';
import { Injectable } from '@nestjs/common';
import { User } from '@users/entities/user.entity';
import { UserAccess } from '@users/user-accesses/entities/user-access.entity';
import { UserAccessStatusType } from '@users/user-accesses/enums/user-access-status-type';
import { isNil } from '@util/isNil';
import { OrmHelper } from '@util/orm.helper';
import { DeleteResult, FindOptionsWhere } from 'typeorm';
import { NotFoundUserAccessExceptionDto } from './dto/exception/not-found-user-access.exception.dto';
import { UserLoginInformationPayloadDto } from './dto/payload/user-login-information.payload.dto';

@Injectable()
export class AuthRepository extends BaseRepository {
  constructor(protected readonly orm: OrmHelper) {
    super(orm);
  }

  softDelete(id: number): Promise<DeleteResult> {
    return this.orm.getRepo(User).softDelete(id);
  }

  existsByWithDeleted(condition: FindOptionsWhere<User>): Promise<boolean> {
    return this.orm.getRepo(User).exists({ where: condition, withDeleted: true });
  }

  existsBy(condition: FindOptionsWhere<User>): Promise<boolean> {
    return this.orm.getRepo(User).exists({ where: condition });
  }

  async findUserById(id: number): Promise<LoginUserData> {
    const user = await this.orm
      .getRepo(User)
      .createQueryBuilder('u')
      .leftJoinAndSelect('u.subscription', 'usb')
      .leftJoinAndMapOne('u.organizationRole', OrganizationRole, 'uor', 'uor.subscriptionId = usb.id AND uor.userId = u.id')
      .leftJoinAndMapOne('u.permission', Permission, 'p', 'p.id = uor.permissionId AND uor.subscriptionId = usb.id AND uor.userId = u.id')
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
      .leftJoinAndMapOne('u.organizationRole', OrganizationRole, 'uor', 'uor.userId = u.id AND uor.subscriptionId = usb.id')
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
        'uor.id',
        'uor.userId',
        'uor.subscriptionId',
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

  async addUserAccessLog(
    id: number,
    ipAddress: string,
    userLoginInformationPayloadDto: UserLoginInformationPayloadDto | null,
    accessStatus: UserAccessStatusType,
  ) {
    const userAccess = new UserAccess();
    userAccess.userId = id;
    userAccess.accessIp = ipAddress;
    userAccess.status = accessStatus;
    userAccess.lastAccessAt = new Date();

    if (userLoginInformationPayloadDto) {
      userAccess.accessDevice = userLoginInformationPayloadDto.accessDevice;
      userAccess.accessBrowser = userLoginInformationPayloadDto.accessBrowser;
      userAccess.accessUserAgent = userLoginInformationPayloadDto.accessUserAgent;
    } else {
      const lastUserAccess = await this.orm
        .getRepo(UserAccess)
        .createQueryBuilder('ua')
        .where('ua.userId = :id', { id })
        .andWhere('ua.lastAccessAt IS NOT NULL AND ua.lastAccessAt > :date', { date: new Date(Date.now() - 1000 * 60 * 60 * 24) })
        .orderBy('ua.lastAccessAt', 'DESC')
        .getOne();

      if (isNil(lastUserAccess)) {
        throw new NotFoundUserAccessExceptionDto(id.toString());
      }

      userAccess.accessDevice = lastUserAccess.accessDevice;
      userAccess.accessBrowser = lastUserAccess.accessBrowser;
      userAccess.accessUserAgent = lastUserAccess.accessUserAgent;
    }
    await this.orm.getRepo(UserAccess).save(userAccess);
  }
}
