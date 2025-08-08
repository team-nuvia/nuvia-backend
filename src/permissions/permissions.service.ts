import { Injectable } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { Permission } from './entities/permission.entity';
import { PermissionsRepository } from './permissions.repository';

@Injectable()
export class PermissionsService {
  constructor(private readonly permissionsRepository: PermissionsRepository) {}

  create(createPermissionDto: CreatePermissionDto) {
    return this.permissionsRepository.orm.getManager().createQueryBuilder(Permission, 'p').insert().values(createPermissionDto).execute();
  }

  findAll() {
    return this.permissionsRepository.orm.getManager().createQueryBuilder(Permission, 'p').getMany();
  }

  findOne(id: number) {
    return this.permissionsRepository.orm.getManager().createQueryBuilder(Permission, 'p').where('p.id = :id', { id }).getOne();
  }

  update(id: number, updatePermissionDto: UpdatePermissionDto) {
    return this.permissionsRepository.orm
      .getManager()
      .createQueryBuilder(Permission, 'p')
      .update()
      .set(updatePermissionDto)
      .where('p.id = :id', { id })
      .execute();
  }
}
