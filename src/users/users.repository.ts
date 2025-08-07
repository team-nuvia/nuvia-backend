import { Organization } from '@/organizations/entities/organization.entity';
import { Permission } from '@/organizations/permissions/entities/permission.entity';
import { Subscription } from '@/subscriptions/entities/subscription.entity';
import { BaseRepository } from '@common/base.repository';
import { CommonService } from '@common/common.service';
import { NotFoundUserExceptionDto } from '@common/dto/exception/not-found-user.exception.dto';
import { BadRequestException } from '@common/dto/response';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isNil } from '@util/isNil';
import { DeepPartial, DeleteResult, FindOptionsWhere, QueryRunner, Repository } from 'typeorm';
import { AlreadyExistsEmailExceptionDto } from './dto/exception/already-exists-email.exception.dto';
import { NotFoundOrganizationExceptionDto } from './dto/exception/not-found-organization.exception.dto';
import { GetUserMeNestedResponseDto } from './dto/response/get-user-me.nested.response.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersRepository extends BaseRepository<User> {
  constructor(
    @InjectRepository(User)
    protected readonly repository: Repository<User>,
    @InjectRepository(Subscription)
    protected readonly subscriptionRepository: Repository<Subscription>,
    private readonly commonService: CommonService,
  ) {
    super(repository);
  }

  softDelete(id: number): Promise<DeleteResult> {
    return this.repository.softDelete(id);
  }

  existsBy(condition: FindOptionsWhere<User>): Promise<boolean> {
    return this.repository.exists({ where: condition });
  }

  async getMe(userId: number): Promise<GetUserMeNestedResponseDto | null> {
    const subscription = await this.subscriptionRepository
      .createQueryBuilder('s')
      .where('s.userId = :userId', { userId })
      .leftJoinAndSelect('s.organization', 'o')
      .leftJoinAndMapOne('o.permission', Permission, 'p', 'p.organizationId = o.id AND p.userId = :userId', { userId })
      .getOne();

    if (isNil(subscription)) {
      throw new NotFoundOrganizationExceptionDto();
    }

    const permission: Permission = (subscription.organization as Organization & { permission: Permission }).permission;

    const userMeData = await this.repository
      .createQueryBuilder('u')
      .leftJoinAndSelect('u.profile', 'up')
      .where('u.id = :userId', { userId })
      .select(['u.id', 'u.email', 'u.name', 'u.createdAt', 'up.filename'])
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
      role: permission.role,
      createdAt: userMeData.createdAt,
      profileImageUrl,
    };

    return responseGetMeData;
  }

  findOneByEmail(email: string): Promise<User | null> {
    return this.repository.findOne({ where: { email } });
  }

  async save(data: DeepPartial<User>, qr?: QueryRunner): Promise<User> {
    const source = qr ? qr.manager.getRepository(User) : this.repository;

    if (isNil(data.email)) {
      throw new BadRequestException({ reason: '이메일이 없습니다.' });
    }

    const user = await this.findOneByEmail(data.email);
    if (user) {
      throw new AlreadyExistsEmailExceptionDto();
    }

    return source.save(data, { reload: true, transaction: true });
  }
}
