import { CombineResponses } from '@common/decorator/combine-responses.decorator';
import { RequiredLogin } from '@common/decorator/required-login.decorator';
import { Body, Controller, HttpStatus, Param, Patch } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UpdateOrganizationDto } from './dto/payload/update-organization.dto';
import { UpdateOrganizationResponseDto } from './dto/response/update-organization.response.dto';
import { OrganizationsService } from './organizations.service';

@RequiredLogin
@ApiTags('조직')
@Controller('organizations')
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @CombineResponses(HttpStatus.OK, UpdateOrganizationResponseDto)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateOrganizationDto: UpdateOrganizationDto) {
    await this.organizationsService.update(+id, updateOrganizationDto);
    return new UpdateOrganizationResponseDto();
  }
}
