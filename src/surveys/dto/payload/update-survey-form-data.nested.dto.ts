import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateSurveyPayloadDto } from './create-survey.payload.dto';

export class UpdateSurveyFormDataNestedDto extends OmitType(PartialType(CreateSurveyPayloadDto), ['questions']) {}
