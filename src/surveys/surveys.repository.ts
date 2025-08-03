import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSurveyPayloadDto } from './dto/payload/create-survey.payload.dto';
import { Survey } from './entities/survey.entity';

@Injectable()
export class SurveysRepository {
  constructor(
    @InjectRepository(Survey)
    private readonly surveyRepository: Repository<Survey>,
  ) {}

  async createSurvey(createSurveyPayloadDto: CreateSurveyPayloadDto) {
    console.log('🚀 ~ SurveysRepository ~ createSurvey ~ createSurveyPayloadDto:', createSurveyPayloadDto);
    const survey = this.surveyRepository.create({
      ...createSurveyPayloadDto,
      expiresAt: createSurveyPayloadDto.expiresAt ?? new Date(),
    });
    console.log('🚀 ~ SurveysRepository ~ createSurvey ~ survey:', survey);
    await this.surveyRepository.save(survey);
  }
}
