import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiResponse,
  ApiResponseExamples,
  getSchemaPath,
} from '@nestjs/swagger';

export const CombineResponses = <T extends (new (...args: any[]) => any)[]>(
  status: HttpStatus,
  ...schemas: T
) => {
  return applyDecorators(
    ApiExtraModels(...schemas),
    ApiResponse({
      status,
      schema: {
        oneOf: schemas.map((schema) => ({
          title: schema.name,
          required: ['ok', 'status', 'method', 'path'],
          $ref: getSchemaPath(schema),
        })),
      },
      examples: {
        ...schemas.reduce(
          (acc, schema) => {
            acc[schema.name] = {
              summary: schema.name,
              value: Object.fromEntries(
                Object.entries(new schema()).sort((a, b) => {
                  const serialize = [
                    'ok',
                    'status',
                    'method',
                    'path',
                    'timestamp',
                    'payload',
                    'message',
                    'reason',
                  ];
                  return serialize.indexOf(a[0]) - serialize.indexOf(b[0]);
                }),
              ),
            };
            return acc;
          },
          {} as Record<string, ApiResponseExamples>,
        ),
      },
    }),
  );
};
