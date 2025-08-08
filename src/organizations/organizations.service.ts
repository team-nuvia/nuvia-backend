import { Injectable } from '@nestjs/common';
import { UpdateOrganizationDto } from './dto/payload/update-organization.dto';
import { OrganizationsRepository } from './organizations.repository';

@Injectable()
export class OrganizationsService {
  constructor(private readonly organizationsRepository: OrganizationsRepository) {}

  async update(id: number, updateOrganizationDto: UpdateOrganizationDto) {
    await this.organizationsRepository.update(id, updateOrganizationDto);
  }
}
