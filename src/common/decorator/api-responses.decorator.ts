import { RequestMethod } from '@common/variable/enums';
import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger';

export const ApiOkResponses = <T extends new (...args: any[]) => any>(
  apiMetadata: ApiMetadata,
  ...schemas: (T | T[])[]
) => {
  const statusMap: Partial<
    Record<(typeof RequestMethod)[keyof typeof RequestMethod], any>
  > = {
    [RequestMethod.GET]: 200,
    [RequestMethod.POST]: 201,
  };
  return applyDecorators(
    ApiExtraModels(...schemas.flat()),
    ApiResponse({
      status: statusMap[apiMetadata.method],
      description: apiMetadata.description,
      schema: {
        oneOf: schemas.map((schema) => ({
          title: schema.constructor.name,
          required: ['ok', 'status', 'method', 'path'],
          properties: {
            ok: {
              type: 'boolean',
              example: true,
            },
            status: {
              type: 'enum',
              enum: Object.keys(HttpStatus),
              example: apiMetadata.status,
            },
            method: {
              type: 'enum',
              enum: Object.keys(RequestMethod),
              example: apiMetadata.method,
            },
            path: {
              type: 'string',
              example: apiMetadata.path,
            },
            message: {
              type: 'string',
              example: apiMetadata.message ?? '<success_message>',
              nullable: true,
            },
            payload: {
              nullable: true,
              ...(Array.isArray(schema)
                ? {
                    type: 'array',
                    items: { $ref: getSchemaPath(schema[0]) },
                  }
                : {
                    type: 'object',
                    $ref: getSchemaPath(schema),
                  }),
            },
          },
        })),
      },
    }),
  );
};

// export const ApiNotFoundResponses = <T extends new (...args: any[]) => any>(
//   apiMetadata: ApiMetadata,
//   ...schemas: T[]
// ) => {
//   return applyDecorators(
//     ApiExtraModels(...schemas),
//     ApiResponse({
//       status: HttpStatus.NOT_FOUND,
//       description: apiMetadata.description,
//       schema: {
//         oneOf: schemas.map((schema) => ({
//           title: schema.constructor.name,
//           required: ['ok', 'status', 'method', 'path'],
//           properties: {
//             ok: {
//               type: 'boolean',
//               example: false,
//             },
//             status: {
//               type: 'enum',
//               enum: Object.keys(HttpStatus),
//               example: apiMetadata.status,
//             },
//             method: {
//               type: 'enum',
//               enum: Object.keys(RequestMethod),
//               example: apiMetadata.method,
//             },
//             path: {
//               type: 'string',
//               example: apiMetadata.path,
//             },
//             message: {
//               type: 'string',
//               example: apiMetadata.message ?? '<notfound_message>',
//               nullable: true,
//             },
//             detail: {
//               type: 'string',
//               example: apiMetadata.message ?? '<message_detail>',
//               nullable: true,
//             },
//           },
//         })),
//       },
//     }),
//   );
// };

// export const ApiBadRequestResponses = <T extends new (...args: any[]) => any>(
//   apiMetadata: ApiMetadata,
//   ...schemas: T[]
// ) => {
//   return applyDecorators(
//     ApiExtraModels(...schemas),
//     ApiResponse({
//       status: HttpStatus.BAD_REQUEST,
//       description: apiMetadata.description,
//       schema: {
//         oneOf: schemas.map((schema) => ({
//           title: schema.constructor.name,
//           required: ['ok', 'status', 'method', 'path'],
//           properties: {
//             ok: {
//               type: 'boolean',
//               example: false,
//             },
//             status: {
//               type: 'enum',
//               enum: Object.keys(HttpStatus),
//               example: apiMetadata.status,
//             },
//             method: {
//               type: 'enum',
//               enum: Object.keys(RequestMethod),
//               example: apiMetadata.method,
//             },
//             path: {
//               type: 'string',
//               example: apiMetadata.path,
//             },
//             message: {
//               type: 'string',
//               example: apiMetadata.message ?? '<badrequest_message>',
//               nullable: true,
//             },
//             detail: {
//               type: 'string',
//               example: apiMetadata.message ?? '<message_detail>',
//               nullable: true,
//             },
//           },
//         })),
//       },
//     }),
//   );
// };

export const ApiErrorResponses = <T extends new (...args: any[]) => any>(
  apiMetadata: ApiMetadata,
  ...schemas: T[]
) => {
  return applyDecorators(
    ApiExtraModels(...schemas),
    ApiResponse({
      status: apiMetadata.status,
      description: apiMetadata.description,
      schema: {
        oneOf: schemas.map((schema) => ({
          title: schema.constructor.name,
          required: ['ok', 'status', 'method', 'path'],
          properties: {
            ok: {
              type: 'boolean',
              example: false,
            },
            status: {
              type: 'enum',
              enum: Object.keys(HttpStatus),
              example: apiMetadata.status,
            },
            method: {
              type: 'enum',
              enum: Object.keys(RequestMethod),
              example: apiMetadata.method,
            },
            path: {
              type: 'string',
              example: apiMetadata.path,
            },
            message: {
              type: 'string',
              example: apiMetadata.message ?? '<error_message>',
              nullable: true,
            },
            detail: {
              type: 'string',
              example: apiMetadata.detail ?? '<message_detail>',
              nullable: true,
            },
          },
        })),
      },
    }),
  );
};
