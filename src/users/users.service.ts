import { NotFoundUserException } from '@common/dto/exception/not-found-user.exception.dto';
import { Injectable } from '@nestjs/common';
import { isNil } from '@util/isNil';
import { UtilService } from '@util/util.service';
import { AlreadyExistsUserExceptionDto } from './dto/exception/already-exists-user.exception.dto';
import { CreateUserPayloadDto } from './dto/payload/create-user.payload.dto';
import { UpdateUserPayloadDto } from './dto/payload/update-user.payload.dto';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: UsersRepository,
    private readonly utilService: UtilService,
  ) {}

  async create({ password, ...createUserDto }: CreateUserPayloadDto) {
    const alreadyExistUser = await this.userRepository.existsBy({
      email: createUserDto.email,
    });

    if (alreadyExistUser) {
      throw new AlreadyExistsUserExceptionDto(createUserDto.email);
    }

    const { hashedPassword, ...userSecret } = this.utilService.hashPassword(password);

    const { userSecret: _, ...newUser } = await this.userRepository.save({
      ...createUserDto,
      userSecret: { ...userSecret, password: hashedPassword },
    });

    return newUser;
  }

  async findMe(id: number) {
    const user = await this.userRepository.findOneById(id);

    if (isNil(user)) {
      throw new NotFoundUserException();
    }

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserPayloadDto) {
    const updated = await this.userRepository.save({ id, ...updateUserDto });
    return updated;
  }

  async remove(id: number) {
    return this.userRepository.softDelete(id);
  }
}
