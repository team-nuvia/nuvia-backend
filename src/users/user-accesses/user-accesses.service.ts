import { Injectable } from '@nestjs/common';
import { GetUserAccessNestedDto } from './dto/response/get-user-access.nested.dto';
import { UserAccessRepository } from './user-accesses.repository';
import { AccessSearchQueryParamDto } from './dto/param/access-search-query.param.dto';
import { GetAllUserAccesseListPaginatedResponseDto } from './dto/response/get-all-user-accesse-list.response.dto';

@Injectable()
export class UserAccessesService {
  constructor(private readonly userAccessRepository: UserAccessRepository) {}

  async findAll(userId: number, searchQuery: AccessSearchQueryParamDto): Promise<GetAllUserAccesseListPaginatedResponseDto> {
    return this.findAll(userId, searchQuery);
  }

  findByUserId(userId: number): Promise<GetUserAccessNestedDto[]> {
    return this.userAccessRepository.findByUserId(userId);
  }
}
