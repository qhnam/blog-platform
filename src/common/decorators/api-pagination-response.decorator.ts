import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';

export const ApiPaginatedResponse = <TModel extends Type<any>>(
  model: TModel,
) => {
  return applyDecorators(
    ApiExtraModels(model), // Thêm model vào Swagger
    ApiOkResponse({
      description: 'Paginated response',
      schema: {
        type: 'object',
        properties: {
          status: { type: 'string', example: 'success' },
          message: { type: 'string', example: 'Successfully' },
          data: {
            type: 'object',
            properties: {
              items: {
                type: 'array',
                items: { $ref: getSchemaPath(model) },
              },
              page: { type: 'integer', example: 1 },
              limit: { type: 'integer', example: 10 },
              totalItems: { type: 'integer', example: 100 },
              totalPages: { type: 'integer', example: 10 },
              hasNextPage: { type: 'boolean', example: true },
              hasPrevPage: { type: 'boolean', example: false },
              additionalInfo: { type: 'object', nullable: true, example: null },
            },
          },
          errorCode: { type: 'string', nullable: true, example: null },
          statusCode: { type: 'integer', example: HttpStatus.OK },
        },
      },
    }),
  );
};
