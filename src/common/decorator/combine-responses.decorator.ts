import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger';
import { serializeResponse } from '@util/serializeResponse';

const REQUIRED_KEYS = ['ok', 'httpStatus', 'name', 'method', 'path', 'timestamp'];

export const CombineResponses = <T extends (new (...args: any[]) => any)[]>(status: HttpStatus, ...schemas: T) => {
  const oneOf = schemas.map((schema) => ({
    title: schema.constructor.name,
    required: REQUIRED_KEYS,
    $ref: getSchemaPath(schema),
  }));

  const apiResponse = {
    status,
    schema: { oneOf },
    examples: Object.fromEntries(
      schemas.map((schema) => [
        schema.name,
        {
          value: serializeResponse(new schema()),
          summary: schema.name,
        },
      ]),
    ),
  };

  return applyDecorators(ApiExtraModels(...schemas), ApiResponse(apiResponse));
};
