import { PartialType } from '@nestjs/swagger';
import { CreateSurveyPayloadDto } from './create-survey.payload.dto';

export class UpdateSurveyFormDataNestedDto extends PartialType(CreateSurveyPayloadDto) {}
