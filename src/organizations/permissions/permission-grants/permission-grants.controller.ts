import { RequiredLogin } from '@common/decorator/required-login.decorator';
import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreatePermissionGrantDto } from './dto/create-permission-grant.dto';
import { UpdatePermissionGrantDto } from './dto/update-permission-grant.dto';
import { PermissionGrantsService } from './permission-grants.service';

@RequiredLogin
@ApiTags('권한 제약사항')
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
