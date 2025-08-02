import { CommonService } from '@common/common.service';
import { Injectable } from '@nestjs/common';
import { isNil } from '@util/isNil';
import crypto from 'crypto';
import imageSize from 'image-size';
import { AlreadyExistsProfileImageExceptionDto } from './dto/exception/already-exists-profile-image.exception.dto';
import { NotFoundProfileExceptionDto } from './dto/exception/not-found-profile.exception.dto';
import { ProfilesRepository } from './profiles.repository';

@Injectable()
export class ProfilesService {
  constructor(
    private readonly profilesRepository: ProfilesRepository,
    private readonly commonService: CommonService,
  ) {}

  async create(userId: number, file: Express.Multer.File) {
    const originalname = file.originalname;
    const mimetype = file.mimetype;
    const size = file.size;
    const buffer = file.buffer;
    const filename = crypto.randomBytes(32).toString('hex') + '.' + originalname.split('.').pop();
    const dimensions = imageSize(buffer);

    const exists = await this.profilesRepository.owner.findOne({ where: { userId } });

    if (!isNil(exists)) {
      throw new AlreadyExistsProfileImageExceptionDto();
    }

    await this.profilesRepository.uploadProfileImage(userId, {
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
    const commonConfig = this.commonService.getConfig('common');
    const profile = await this.profilesRepository.useManager().owner.findOne({
      where: { userId },
    });

    if (isNil(profile)) {
      throw new NotFoundProfileExceptionDto();
    }

    const { id, userId: uid, buffer, ...rest } = profile;

    return {
      ...rest,
      imageUrl: {
        preview: {
          low: `${commonConfig.serverUrl}/api/static/image/${rest.filename}?t=p&q=20&rs=jpeg`,
          mid: `${commonConfig.serverUrl}/api/static/image/${rest.filename}?t=p&q=50&rs=jpeg`,
          high: `${commonConfig.serverUrl}/api/static/image/${rest.filename}?t=p&q=100&rs=jpeg`,
        },
        download: {
          low: `${commonConfig.serverUrl}/api/static/image/${rest.filename}?t=d&q=20&rs=jpeg`,
          mid: `${commonConfig.serverUrl}/api/static/image/${rest.filename}?t=d&q=50&rs=jpeg`,
          high: `${commonConfig.serverUrl}/api/static/image/${rest.filename}?t=d&q=100&rs=jpeg`,
        },
      },
    };
  }

  async update(userId: number, file: Express.Multer.File) {
    const profile = await this.profilesRepository.useManager().owner.findOne({
      where: { userId },
    });

    if (isNil(profile)) {
      throw new NotFoundProfileExceptionDto();
    }

    const originalname = file.originalname;
    const mimetype = file.mimetype;
    const size = file.size;
    const buffer = file.buffer;
    const filename = crypto.randomBytes(32).toString('hex') + '.' + originalname.split('.').pop();
    const dimensions = imageSize(buffer);

    await this.profilesRepository.useManager().owner.update(
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
    const profile = await this.profilesRepository.useManager().owner.findOne({
      where: { userId },
    });

    if (isNil(profile)) {
      throw new NotFoundProfileExceptionDto();
    }

    return this.profilesRepository.useManager().owner.delete({ userId });
  }
}
