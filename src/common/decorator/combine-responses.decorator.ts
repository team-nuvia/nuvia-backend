import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiResponse,
  ApiResponseExamples,
  getSchemaPath,
} from '@nestjs/swagger';
import { instanceToPlain } from 'class-transformer';

type SwaggerValue = Record<string, ApiResponseExamples>;

const HIDDEN_KEYS = ['cause', 'status', 'response'];
const SERIALIZED_KEYS = [
  'ok',
  'httpStatus',
  'name',
  'method',
  'path',
  'timestamp',
  'payload',
  'message',
  'reason',
];
const REQUIRED_KEYS = [
  'ok',
  'httpStatus',
  'name',
  'method',
  'path',
  'timestamp',
];

const getSwaggerValue = (
  acc: SwaggerValue,
  schema: new (...args: any[]) => any,
) => {
  const instance = new schema();

  // class-transformer로 직렬화해서 @Exclude() 적용되게
  const plain = instanceToPlain(instance);

  acc[schema.name] = {
    summary: schema.name,
    value: Object.fromEntries(
      Object.entries(plain)
        .filter(([key]) => !HIDDEN_KEYS.includes(key))
        .sort((a, b) => {
          return SERIALIZED_KEYS.indexOf(a[0]) - SERIALIZED_KEYS.indexOf(b[0]);
        }),
    ),
  };
  return acc;
};

export const CombineResponses = <T extends (new (...args: any[]) => any)[]>(
  status: HttpStatus,
  ...schemas: T
) => {
  const oneOf = schemas.map((schema) => ({
    title: schema.name,
    required: REQUIRED_KEYS,
    $ref: getSchemaPath(schema),
  }));

  const examples = schemas.reduce(getSwaggerValue, {} as SwaggerValue);

  const apiResponse = {
    status,
    schema: { oneOf },
    examples: { ...examples },
  };

  return applyDecorators(ApiExtraModels(...schemas), ApiResponse(apiResponse));
};
