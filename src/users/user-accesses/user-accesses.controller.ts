import { CombineResponses } from '@common/decorator/combine-responses.decorator';
import { RequiredLogin } from '@common/decorator/required-login.decorator';
import { Controller, Get, HttpStatus, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GetAllUserAccesseListResponseDto } from './dto/response/get-all-user-accesse-list.response.dto';
import { GetUserAccessesResponseDto } from './dto/response/get-user-accesses.response.dto';
import { UserAccessesService } from './user-accesses.service';

@RequiredLogin
@ApiTags('사용자 접근 로그')
@Controller('user-accesses')
export class UserAccessesController {
  constructor(private readonly userAccessesService: UserAccessesService) {}

  @CombineResponses(HttpStatus.OK, GetAllUserAccesseListResponseDto)
  @Get()
  async findAll() {
    const userAccessList = await this.userAccessesService.findAll();
    return new GetAllUserAccesseListResponseDto(userAccessList);
  }

  @CombineResponses(HttpStatus.OK, GetUserAccessesResponseDto)
  @Get(':userId')
  async findByUserId(@Param('userId') userId: string) {
    const userAccessList = await this.userAccessesService.findByUserId(+userId);
    return new GetUserAccessesResponseDto(userAccessList);
  }
}
