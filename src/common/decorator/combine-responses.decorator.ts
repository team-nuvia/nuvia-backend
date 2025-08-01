import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, ApiResponseOptions, getSchemaPath } from '@nestjs/swagger';
import { serializeResponse } from '@util/serializeResponse';

const REQUIRED_KEYS = ['ok', 'httpStatus', 'name', 'method', 'path', 'timestamp'];

export const CombineResponses = <T extends (new (...args: any[]) => any)[]>(status: HttpStatus, ...schemas: T) => {
  const oneOf = schemas.map((schema) => ({
    title: schema.constructor.name,
    required: REQUIRED_KEYS,
    $ref: getSchemaPath(schema),
  }));

  const apiResponse: ApiResponseOptions = {
    status,
    content: {
      'application/json': {
        examples: Object.fromEntries(
          schemas.map((schema) => [
            schema.name,
            {
              summary: schema.name,
              value: serializeResponse(new schema()),
            },
          ]),
        ),
        schema: {
          oneOf,
        },
      },
    },
  };

  return applyDecorators(ApiExtraModels(...schemas), ApiResponse(apiResponse));
};
