import { PartialType } from '@nestjs/swagger';
import { CreateAnswerPayloadDto } from './create-answer.payload.dto';

export class UpdateAnswerPayloadDto extends PartialType(CreateAnswerPayloadDto) {}
