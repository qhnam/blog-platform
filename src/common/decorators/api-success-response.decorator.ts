import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';

export const ApiSuccessResponse = <TModel extends Type<any>>(model: TModel) => {
  return applyDecorators(
    ApiExtraModels(model),
    ApiOkResponse({
      description: 'Success response',
      schema: {
        type: 'object',
        properties: {
          status: { type: 'string', example: 'success' },
          message: { type: 'string', example: 'Successfully' },
          data: { $ref: getSchemaPath(model) },
          errorCode: { type: 'string', nullable: true, example: null },
          statusCode: { type: 'integer', example: HttpStatus.OK },
        },
      },
    }),
  );
};
