import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetUserAccessNestedDto } from './dto/response/get-user-access.nested.dto';
import { UserAccess } from './entities/user-access.entity';

@Injectable()
export class UserAccessRepository {
  constructor(
    @InjectRepository(UserAccess)
    private readonly userAccessRepository: Repository<UserAccess>,
  ) {}

  async findAll(): Promise<GetUserAccessNestedDto[]> {
    const userAccessList = await this.userAccessRepository.find({
      relations: ['user'],
    });

    return userAccessList.map<GetUserAccessNestedDto>((userAccess) => ({
      id: userAccess.id,
      accessIp: userAccess.accessIp,
      accessDevice: userAccess.accessDevice,
      accessBrowser: userAccess.accessBrowser,
      accessUserAgent: userAccess.accessUserAgent,
      lastAccessAt: userAccess.lastAccessAt,
      user: {
        id: userAccess.user.id,
        name: userAccess.user.name,
        email: userAccess.user.email,
        nickname: userAccess.user.nickname,
      },
    }));
  }

  findByUserId(userId: number): Promise<GetUserAccessNestedDto[]> {
    return this.userAccessRepository.find({ where: { userId } });
  }
}
