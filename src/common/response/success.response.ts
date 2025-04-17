import { HttpStatus } from '@nestjs/common';

export class SuccessResponse {
  static call(
    data: any = null,
    message = 'Successfully',
    statusCode = HttpStatus.OK,
  ) {
    return {
      status: 'success',
      message,
      data,
      errorCode: null,
      statusCode,
    };
  }
}
