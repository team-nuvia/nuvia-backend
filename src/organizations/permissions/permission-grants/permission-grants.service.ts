import { Injectable } from '@nestjs/common';
import { CreatePermissionGrantDto } from './dto/create-permission-grant.dto';
import { UpdatePermissionGrantDto } from './dto/update-permission-grant.dto';

@Injectable()
export class PermissionGrantsService {
  create(createPermissionGrantDto: CreatePermissionGrantDto) {
    return 'This action adds a new permissionGrant';
  }

  findAll() {
    return `This action returns all permissionGrants`;
  }

  findOne(id: number) {
    return `This action returns a #${id} permissionGrant`;
  }

  update(id: number, updatePermissionGrantDto: UpdatePermissionGrantDto) {
    return `This action updates a #${id} permissionGrant`;
  }

  remove(id: number) {
    return `This action removes a #${id} permissionGrant`;
  }
}
