import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserSecretsService } from './user-secrets.service';
import { CreateUserSecretDto } from './dto/create-user-secret.dto';
import { UpdateUserSecretDto } from './dto/update-user-secret.dto';

@Controller('user-secrets')
export class UserSecretsController {
  constructor(private readonly userSecretsService: UserSecretsService) {}

  @Post()
  create(@Body() createUserSecretDto: CreateUserSecretDto) {
    return this.userSecretsService.create(createUserSecretDto);
  }

  @Get()
  findAll() {
    return this.userSecretsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userSecretsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserSecretDto: UpdateUserSecretDto) {
    return this.userSecretsService.update(+id, updateUserSecretDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userSecretsService.remove(+id);
  }
}
