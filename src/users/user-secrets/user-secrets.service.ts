import {
  BadRequestResponseDto,
  NotFoundResponseDto,
} from '@common/dto/global-response.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UtilService } from '@util/util.service';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { BodyChangePasswordDto } from './dto/body-change-password.dto';
import { UserSecret } from './entities/user-secret.entity';

@Injectable()
export class UserSecretsService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserSecret)
    private readonly userSecretRepository: Repository<UserSecret>,
    private readonly utilService: UtilService,
  ) {}

  async changePassword(
    userId: number,
    changePasswordDto: BodyChangePasswordDto,
  ) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: { userSecret: true },
      select: {
        userSecret: { password: true },
      },
    });

    if (!user) {
      throw new NotFoundResponseDto();
    }

    const { userSecret } = user;
    const verifyContent = {
      password: userSecret.password,
      salt: userSecret.salt,
      iteration: userSecret.iteration,
    };

    const isSamePassword = this.utilService.verifyPassword(
      changePasswordDto.prevPassword,
      verifyContent,
    );

    if (!isSamePassword) {
      throw new BadRequestResponseDto();
    }

    const updatedUserSecret = await this.userSecretRepository.update(user.id, {
      password: changePasswordDto.newPassword,
    });

    return updatedUserSecret.generatedMaps[0].id;
  }
}
