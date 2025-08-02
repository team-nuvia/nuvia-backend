// import { applyDecorators, HttpStatus } from '@nestjs/common';
// import { ApiExtraModels, ApiResponse, ApiResponseOptions, getSchemaPath } from '@nestjs/swagger';
// import { extractExampleFromDto } from '@util/extractExampleFromDto';
// import { serializeResponse } from '@util/serializeResponse';

// const REQUIRED_KEYS = ['ok', 'httpStatus', 'name', 'method', 'path', 'timestamp'];

// export const CombineResponses = <T extends (new (...args: any[]) => any)[]>(status: HttpStatus, ...schemas: T) => {
//   const nestedModels = new Set<new () => any>();
//   const oneOf = schemas.map((schema) => {
//     const { example, nestedRefs } = extractExampleFromDto(schema);
//     nestedRefs.forEach((ref) => nestedModels.add(ref));
//     return {
//       title: schema.constructor.name,
//       required: REQUIRED_KEYS,
//       $ref: getSchemaPath(schema),
//       examples: {
//         [schema.constructor.name]: {
//           value: example,
//         },
//       },
//     };
//   });

//   const examples = Object.fromEntries(
//     schemas.map((schema) => {
//       const { example, nestedRefs } = extractExampleFromDto(schema);
//       nestedRefs.forEach((ref) => nestedModels.add(ref));
//       return [
//         schema.name,
//         {
//           summary: schema.name,
//           value: serializeResponse(example),
//         },
//       ];
//     }),
//   );

//   const apiResponse: ApiResponseOptions = {
//     status,
//     content: {
//       'application/json': {
//         examples,
//         /* examples: Object.fromEntries(
//           schemas.map((schema) => [
//             schema.name,
//             {
//               summary: schema.name,
//               value: serializeResponse(new schema()),
//             },
//           ]),
//         ), */
//         schema: {
//           oneOf,
//         },
//       },
//     },
//   };

//   return applyDecorators(ApiExtraModels(...schemas, ...nestedModels), ApiResponse(apiResponse));
// };

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
