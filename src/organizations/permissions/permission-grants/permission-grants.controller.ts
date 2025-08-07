import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PermissionGrantsService } from './permission-grants.service';
import { CreatePermissionGrantDto } from './dto/create-permission-grant.dto';
import { UpdatePermissionGrantDto } from './dto/update-permission-grant.dto';

@Controller('permission-grants')
export class PermissionGrantsController {
  constructor(private readonly permissionGrantsService: PermissionGrantsService) {}

  @Post()
  create(@Body() createPermissionGrantDto: CreatePermissionGrantDto) {
    return this.permissionGrantsService.create(createPermissionGrantDto);
  }

  @Get()
  findAll() {
    return this.permissionGrantsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.permissionGrantsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePermissionGrantDto: UpdatePermissionGrantDto) {
    return this.permissionGrantsService.update(+id, updatePermissionGrantDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.permissionGrantsService.remove(+id);
  }
}
