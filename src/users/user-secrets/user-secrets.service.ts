import { Injectable } from '@nestjs/common';
import { CreateUserSecretDto } from './dto/create-user-secret.dto';
import { UpdateUserSecretDto } from './dto/update-user-secret.dto';

@Injectable()
export class UserSecretsService {
  create(createUserSecretDto: CreateUserSecretDto) {
    return 'This action adds a new userSecret';
  }

  findAll() {
    return `This action returns all userSecrets`;
  }

  findOne(id: number) {
    return `This action returns a #${id} userSecret`;
  }

  update(id: number, updateUserSecretDto: UpdateUserSecretDto) {
    return `This action updates a #${id} userSecret`;
  }

  remove(id: number) {
    return `This action removes a #${id} userSecret`;
  }
}
