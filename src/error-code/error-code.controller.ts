import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateErrorCodeDto } from './dto/create-error-code.dto';
import { UpdateErrorCodeDto } from './dto/update-error-code.dto';
import { ErrorCodeService } from './error-code.service';

@ApiTags('에러 코드')
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
  update(
    @Param('id') id: string,
    @Body() updateErrorCodeDto: UpdateErrorCodeDto,
  ) {
    return this.errorCodeService.update(+id, updateErrorCodeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.errorCodeService.remove(+id);
  }
}
