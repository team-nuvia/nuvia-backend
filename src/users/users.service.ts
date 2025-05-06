import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UtilService } from '@util/util.service';
import { FindOptionsWhere, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly utilService: UtilService,
  ) {}

  async create({ password, ...createUserDto }: CreateUserDto) {
    const alreadyExistUser = await this.isExistUserBy({
      email: createUserDto.email,
    });
    if (alreadyExistUser) {
      throw new ConflictException('이미 존재하는 사용자입니다.');
    }
    const user = this.userRepository.create();
    Object.assign(user, createUserDto);
    const { hashedPassword, ...userSecret } =
      this.utilService.hashPassword(password);
    Object.assign(user, {
      userSecret: { ...userSecret, password: hashedPassword },
    });
    const { userSecret: _, ...newUser } = await this.userRepository.save(user, {
      transaction: true,
    });
    return newUser;
  }

  findMe(id: number) {
    return this.userRepository.findOne({ where: { id } });
  }

  isExistUserBy(condition: FindOptionsWhere<User> | FindOptionsWhere<User>[]) {
    return this.userRepository.existsBy(condition);
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.userRepository.update(id, updateUserDto);
  }

  async remove(id: number) {
    return this.userRepository.softDelete(id);
  }
}
