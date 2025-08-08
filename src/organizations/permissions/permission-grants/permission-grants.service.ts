import { Injectable } from '@nestjs/common';
import { CreatePermissionGrantDto } from './dto/create-permission-grant.dto';
import { UpdatePermissionGrantDto } from './dto/update-permission-grant.dto';
import { PermissionGrant } from './entities/permission-grant.entity';
import { PermissionGrantsRepository } from './permission-grants.repository';

@Injectable()
export class PermissionGrantsService {
  constructor(private readonly permissionGrantsRepository: PermissionGrantsRepository) {}

  create(createPermissionGrantDto: CreatePermissionGrantDto) {
    return this.permissionGrantsRepository.orm
      .getManager()
      .createQueryBuilder(PermissionGrant, 'pg')
      .insert()
      .values(createPermissionGrantDto)
      .execute();
  }

  findAll() {
    return this.permissionGrantsRepository.orm.getManager().createQueryBuilder(PermissionGrant, 'pg').getMany();
  }

  findOne(id: number) {
    return this.permissionGrantsRepository.orm.getManager().createQueryBuilder(PermissionGrant, 'pg').where('pg.id = :id', { id }).getOne();
  }

  update(id: number, updatePermissionGrantDto: UpdatePermissionGrantDto) {
    return this.permissionGrantsRepository.orm
      .getManager()
      .createQueryBuilder(PermissionGrant, 'pg')
      .update()
      .set(updatePermissionGrantDto)
      .where('pg.id = :id', { id })
      .execute();
  }

  remove(id: number) {
    return this.permissionGrantsRepository.orm
      .getManager()
      .createQueryBuilder(PermissionGrant, 'pg')
      .softDelete()
      .where('pg.id = :id', { id })
      .execute();
  }
}
