import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger';

// type SwaggerValue = Record<string, ApiResponseExamples>;

const REQUIRED_KEYS = [
  'ok',
  'httpStatus',
  'name',
  'method',
  'path',
  'timestamp',
];

// const getSwaggerValue = (
//   acc: SwaggerValue,
//   schema: new (...args: any[]) => any,
// ) => {
//   const instance = new schema();

//   acc[schema.name] = {
//     summary: schema.name,
//     value: serializeResponse(instance),
//   };
//   return acc;
// };

export const CombineResponses = <T extends (new (...args: any[]) => any)[]>(
  status: HttpStatus,
  ...schemas: T
) => {
  const oneOf = schemas.map((schema) => ({
    title: schema.name,
    required: REQUIRED_KEYS,
    $ref: getSchemaPath(schema),
  }));

  // const examples = schemas.reduce(getSwaggerValue, {} as SwaggerValue);

  const apiResponse = {
    status,
    schema: { oneOf },
    // examples: { ...examples },
  };

  return applyDecorators(ApiExtraModels(...schemas), ApiResponse(apiResponse));
};
