import { Conflict } from '@common/dto/exception-response.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UtilService } from '@util/util.service';
import { FindOptionsWhere, Repository } from 'typeorm';
import { BodyCreateUserDto } from './dto/body-create-user.dto';
import { BodyUpdateUserDto } from './dto/body-update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly utilService: UtilService,
  ) {}

  async create({ password, ...createUserDto }: BodyCreateUserDto) {
    const alreadyExistUser = await this.isExistUserBy({
      email: createUserDto.email,
    });

    if (alreadyExistUser) {
      throw new Conflict('이미 존재하는 사용자입니다.', createUserDto.email);
    }

    const { hashedPassword, ...userSecret } =
      this.utilService.hashPassword(password);

    const { userSecret: _, ...newUser } = await this.userRepository.save(
      {
        ...createUserDto,
        userSecret: { ...userSecret, password: hashedPassword },
      },
      {
        transaction: true,
      },
    );

    return newUser;
  }

  findMe(id: number) {
    return this.userRepository.findOne({ where: { id } });
  }

  isExistUserBy(condition: FindOptionsWhere<User> | FindOptionsWhere<User>[]) {
    return this.userRepository.existsBy(condition);
  }

  async update(id: number, updateUserDto: BodyUpdateUserDto) {
    const updated = await this.userRepository.save(
      { id, ...updateUserDto },
      { transaction: true, reload: true },
    );
    return updated;
  }

  async remove(id: number) {
    return this.userRepository.softDelete(id);
  }
}
