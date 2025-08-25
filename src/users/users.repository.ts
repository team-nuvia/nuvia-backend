import { OrganizationRole } from '@/subscriptions/organization-roles/entities/organization-role.entity';
import { BaseRepository } from '@common/base.repository';
import { CommonService } from '@common/common.service';
import { NotFoundUserExceptionDto } from '@common/dto/exception/not-found-user.exception.dto';
import { BadRequestException } from '@common/dto/response';
import { Injectable } from '@nestjs/common';
import { isNil } from '@util/isNil';
import { OrmHelper } from '@util/orm.helper';
import { DeepPartial, FindOptionsWhere } from 'typeorm';
import { AlreadyExistsEmailExceptionDto } from './dto/exception/already-exists-email.exception.dto';
import { GetUserMeNestedResponseDto } from './dto/response/get-user-me.nested.response.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersRepository extends BaseRepository {
  constructor(
    readonly orm: OrmHelper,
    private readonly commonService: CommonService,
  ) {
    super(orm);
  }

  async softDelete(id: number): Promise<void> {
    await this.orm.getRepo(User).softDelete(id);
  }

  existsByWithDeleted(condition: FindOptionsWhere<User>): Promise<boolean> {
    return this.orm.getRepo(User).exists({ where: condition, withDeleted: true });
  }

  existsBy(condition: FindOptionsWhere<User>): Promise<boolean> {
    return this.orm.getRepo(User).exists({ where: condition });
  }

  async getMe(userId: number): Promise<GetUserMeNestedResponseDto | null> {
    const subscription = await this.getCurrentOrganization(userId);

    const userMeData = await this.orm
      .getRepo(User)
      .createQueryBuilder('u')
      .leftJoinAndSelect('u.profile', 'up')
      .where('u.id = :userId', { userId })
      .select(['u.id', 'u.email', 'u.name', 'u.createdAt', 'up.id', 'up.filename', 'up.originalname'])
      .getOne();

    if (isNil(userMeData)) {
      throw new NotFoundUserExceptionDto();
    }

    const profileImageUrl = userMeData.getProfileUrl(this.commonService);

    const responseGetMeData: GetUserMeNestedResponseDto = {
      id: userMeData.id,
      email: userMeData.email,
      name: userMeData.name,
      nickname: userMeData.nickname,
      role: subscription.permission.role,
      currentOrganization: {
        id: subscription.id,
        name: subscription.name,
        description: subscription.description,
        target: subscription.target,
        status: subscription.status,
        createdAt: subscription.createdAt,
        updatedAt: subscription.updatedAt,
      },
      createdAt: userMeData.createdAt,
      profileImageUrl,
    };

    return responseGetMeData;
  }

  findOneByEmail(email: string): Promise<User | null> {
    return this.orm.getRepo(User).findOne({ where: { email } });
  }

  async save(data: DeepPartial<User>): Promise<User> {
    const source = this.orm.getRepo(User);

    if (isNil(data.email)) {
      throw new BadRequestException({ reason: '이메일이 없습니다.' });
    }

    const user = await this.findOneByEmail(data.email);
    if (user) {
      throw new AlreadyExistsEmailExceptionDto();
    }

    return source.save(data, { reload: true, transaction: true });
  }

  async updateUserOrganization(userId: number, organizationId: number): Promise<void> {
    await this.orm.getRepo(OrganizationRole).update({ userId, isActive: true }, { isActive: false });
    await this.orm.getRepo(OrganizationRole).update({ userId, subscriptionId: organizationId, isJoined: true }, { isActive: true });
    return;
  }
}
