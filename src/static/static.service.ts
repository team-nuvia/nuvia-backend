import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NotFoundProfileExceptionDto } from '@users/profiles/dto/exception/not-found-profile.exception.dto';
import { Profile } from '@users/profiles/entities/profile.entity';
import { isNil } from '@util/isNil';
import { Response } from 'express';
import sharp from 'sharp';
import { Repository } from 'typeorm';
import { SizeOverExceptionDto } from './dto/exception/size-over.exception.dto';
import { QueryGetProfileImagePayloadDto } from './dto/payload/query-get-profile-image.payload.dto';

@Injectable()
export class StaticService {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
  ) {}

  async findOneByFilename(res: Response, query: QueryGetProfileImagePayloadDto, profileFilename: string) {
    const { type, quality, dimension, responseType } = query;

    const profile = await this.profileRepository.findOne({
      where: { filename: profileFilename },
    });

    if (isNil(profile)) {
      throw new NotFoundProfileExceptionDto('profile');
    }

    const { originalname, mimetype, buffer, width, height } = profile;

    if (!isNil(dimension) && (dimension.width > width || dimension.height > height)) {
      throw new SizeOverExceptionDto(JSON.stringify({ dimension, width, height }));
    }

    const contentType = type === 'p' ? mimetype : 'application/octet-stream';

    let sharpData = sharp(buffer).withMetadata().toFormat(responseType, { quality });

    sharpData = sharpData.resize(dimension?.width ?? width, dimension?.height ?? height, {
      fit: 'contain',
      withoutEnlargement: true,
    });
    console.log('🚀 ~ StaticService ~ dimension:', dimension);

    res.setHeader('content-type', contentType);
    res.setHeader('content-disposition', `inline; filename="${originalname}"`);

    const touchedBuffer = await sharpData.toBuffer();
    return touchedBuffer;
  }
}
