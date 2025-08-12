import { Injectable } from '@nestjs/common';
import { GetUserAccessNestedDto } from './dto/response/get-user-access.nested.dto';
import { UserAccessRepository } from './user-accesses.repository';

@Injectable()
export class UserAccessesService {
  constructor(private readonly userAccessRepository: UserAccessRepository) {}

  findAll(): Promise<GetUserAccessNestedDto[]> {
    return this.userAccessRepository.findAll();
  }

  findByUserId(userId: number): Promise<GetUserAccessNestedDto[]> {
    return this.userAccessRepository.findByUserId(userId);
  }
}
