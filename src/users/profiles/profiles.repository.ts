import { BaseRepository } from '@common/base.repository';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile } from './entities/profile.entity';

@Injectable()
export class ProfilesRepository extends BaseRepository<Profile> {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
  ) {
    super(profileRepository);
  }

  async findByUserId(userId: number) {
    return this.profileRepository.findOne({ where: { userId } });
  }

  async uploadProfileImage(userId: number, profile: Partial<Omit<Profile, 'userId'>>) {
    return this.profileRepository.save({ userId, ...profile });
  }
}
