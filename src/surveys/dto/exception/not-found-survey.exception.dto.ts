import { ErrorKey, NotFoundException } from '@common/dto/response';
import { ApiProperty } from '@nestjs/swagger';

export class NotFoundSurveyExceptionDto extends NotFoundException {
  @ApiProperty({
    description: '설문 메시지',
    example: '설문 조회 성공',
  })
  message: string = '설문이 존재하지 않습니다.';

  constructor() {
    super({ code: ErrorKey.NOT_FOUND_SURVEY });
  }
}
