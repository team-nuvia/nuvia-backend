import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ErrorCodeService } from './error-code.service';
import { CreateErrorCodeDto } from './dto/create-error-code.dto';
import { UpdateErrorCodeDto } from './dto/update-error-code.dto';

@Controller('error-code')
export class ErrorCodeController {
  constructor(private readonly errorCodeService: ErrorCodeService) {}

  @Post()
  create(@Body() createErrorCodeDto: CreateErrorCodeDto) {
    return this.errorCodeService.create(createErrorCodeDto);
  }

  @Get()
  findAll() {
    return this.errorCodeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.errorCodeService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateErrorCodeDto: UpdateErrorCodeDto) {
    return this.errorCodeService.update(+id, updateErrorCodeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.errorCodeService.remove(+id);
  }
}
