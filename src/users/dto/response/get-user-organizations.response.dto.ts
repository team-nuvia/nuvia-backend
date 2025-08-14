import { ErrorMessage, GetResponse } from '@common/dto/response';
import { ApiProperty } from '@nestjs/swagger';
import { SubscriptionStatusType } from '@share/enums/subscription-status-type';
import { SubscriptionTargetType } from '@share/enums/subscription-target-type';
import { IOrganization } from '@share/interface/iorganization';

export class OrganizationDataDto implements IOrganization {
  @ApiProperty({
    example: 1,
  })
  id: number = 1;

  @ApiProperty({
    example: '예시 조직 이름',
  })
  name: string = '예시 조직 이름';

  @ApiProperty({
    example: '예시 설명',
    nullable: true,
  })
  description: string | null = '예시 설명';

  @ApiProperty({
    enum: SubscriptionTargetType,
    example: SubscriptionTargetType.Individual,
  })
  target: SubscriptionTargetType = SubscriptionTargetType.Individual;

  @ApiProperty({
    enum: SubscriptionStatusType,
    example: SubscriptionStatusType.Active,
  })
  status: SubscriptionStatusType = SubscriptionStatusType.Active;

  @ApiProperty({
    example: new Date(),
  })
  createdAt: Date = new Date();

  @ApiProperty({
    example: new Date(),
  })
  updatedAt: Date = new Date();
}

export class GetUserOrganizationsDataDto {
  @ApiProperty({
    type: () => OrganizationDataDto,
    example: new OrganizationDataDto(),
  })
  currentOrganization: OrganizationDataDto = new OrganizationDataDto();

  @ApiProperty({
    type: () => OrganizationDataDto,
    isArray: true,
    example: [new OrganizationDataDto()],
  })
  organizations: OrganizationDataDto[] = [new OrganizationDataDto()];
}

export class GetUserOrganizationsResponseDto extends GetResponse<GetUserOrganizationsDataDto> {
  @ApiProperty({
    example: ErrorMessage.SUCCESS_GET_USER_ORGANIZATIONS,
  })
  message: string = ErrorMessage.SUCCESS_GET_USER_ORGANIZATIONS;

  @ApiProperty({
    type: () => GetUserOrganizationsDataDto,
    example: new GetUserOrganizationsDataDto(),
  })
  declare payload: GetUserOrganizationsDataDto;

  constructor(payload: GetUserOrganizationsDataDto = new GetUserOrganizationsDataDto()) {
    super(payload);
  }
}
