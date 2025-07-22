import { NotFoundUserException } from '@common/dto/exception/not-found-user.exception.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isNil } from '@util/isNil';
import { UtilService } from '@util/util.service';
import { FindOptionsWhere, Repository } from 'typeorm';
import { BodyCreateUserDto } from './dto/body-create-user.dto';
import { BodyUpdateUserDto } from './dto/body-update-user.dto';
import { User } from './entities/user.entity';
import { AlreadyExistsUserException } from './exception/already-exists-user.exception';

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
      throw new AlreadyExistsUserException(createUserDto.email);
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
