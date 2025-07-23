import { NotFoundUserException } from '@common/dto/exception/not-found-user.exception.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isNil } from '@util/isNil';
import { UtilService } from '@util/util.service';
import { FindOptionsWhere, Repository } from 'typeorm';
import { CreateUserPayloadDto } from './dto/payload/create-user.payload.dto';
import { AlreadyExistsUserExceptionDto } from './dto/exception/already-exists-user.exception.dto';
import { UpdateUserPayloadDto } from './dto/payload/update-user.payload.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly utilService: UtilService,
  ) {}

  async create({ password, ...createUserDto }: CreateUserPayloadDto) {
    const alreadyExistUser = await this.isExistUserBy({
      email: createUserDto.email,
    });

    if (alreadyExistUser) {
      throw new AlreadyExistsUserExceptionDto(createUserDto.email);
    }

    const { hashedPassword, ...userSecret } = this.utilService.hashPassword(password);

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

  async findMe(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });

    if (isNil(user)) {
      throw new NotFoundUserException();
    }

    return user;
  }

  isExistUserBy(condition: FindOptionsWhere<User> | FindOptionsWhere<User>[]) {
    return this.userRepository.existsBy(condition);
  }

  async update(id: number, updateUserDto: UpdateUserPayloadDto) {
    const updated = await this.userRepository.save({ id, ...updateUserDto }, { transaction: true, reload: true });
    return updated;
  }

  async remove(id: number) {
    return this.userRepository.softDelete(id);
  }
}
