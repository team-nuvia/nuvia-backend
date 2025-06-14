import { CommonService } from '@common/common.service';
import { ApiDocs } from '@common/variable/dsl';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isNil } from '@util/isNil';
import crypto from 'crypto';
import imageSize from 'image-size';
import { Repository } from 'typeorm';
import { Profile } from './entities/profile.entity';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
    private readonly commonService: CommonService,
  ) {}

  async create(userId: number, file: Express.Multer.File) {
    const originalname = file.originalname;
    const mimetype = file.mimetype;
    const size = file.size;
    const buffer = file.buffer;
    const filename =
      crypto.randomBytes(32).toString('hex') +
      '.' +
      originalname.split('.').pop();
    const dimensions = imageSize(buffer);

    await this.profileRepository.save({
      userId,
      originalname,
      filename,
      mimetype,
      width: dimensions.width,
      height: dimensions.height,
      size,
      buffer,
    });
  }

  async findOne(userId: number) {
    try {
      const commonConfig = this.commonService.getConfig('common');
      const {
        id,
        userId: uid,
        buffer,
        ...profile
      } = await this.profileRepository.findOneOrFail({
        where: { userId },
      });
      return {
        ...profile,
        imageUrl: {
          preview: {
            low: `${commonConfig.serverUrl}/api/static/image/${profile.filename}?t=p&q=20&rs=jpeg`,
            mid: `${commonConfig.serverUrl}/api/static/image/${profile.filename}?t=p&q=50&rs=jpeg`,
            high: `${commonConfig.serverUrl}/api/static/image/${profile.filename}?t=p&q=100&rs=jpeg`,
          },
          download: {
            low: `${commonConfig.serverUrl}/api/static/image/${profile.filename}?t=d&q=20&rs=jpeg`,
            mid: `${commonConfig.serverUrl}/api/static/image/${profile.filename}?t=d&q=50&rs=jpeg`,
            high: `${commonConfig.serverUrl}/api/static/image/${profile.filename}?t=d&q=100&rs=jpeg`,
          },
        },
      };
    } catch (error) {
      throw new ApiDocs.DslNotFoundProfile();
    }
  }

  async update(userId: number, file: Express.Multer.File) {
    const profile = await this.profileRepository.findOne({
      where: { userId },
    });

    if (isNil(profile)) {
      throw new ApiDocs.DslNotFoundProfile();
    }

    const originalname = file.originalname;
    const mimetype = file.mimetype;
    const size = file.size;
    const buffer = file.buffer;
    const filename =
      crypto.randomBytes(32).toString('hex') +
      '.' +
      originalname.split('.').pop();
    const dimensions = imageSize(buffer);

    await this.profileRepository.update(
      { userId },
      {
        originalname,
        filename,
        mimetype,
        width: dimensions.width,
        height: dimensions.height,
        size,
        buffer: file.buffer,
      },
    );
  }

  async remove(userId: number) {
    const profile = await this.profileRepository.findOne({
      where: { userId },
    });

    if (isNil(profile)) {
      throw new ApiDocs.DslNotFoundProfile();
    }

    return this.profileRepository.delete({ userId });
  }
}
