import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { ErrorException } from './error.exception';
import { Response } from 'express';

@Catch()
export class HttpFilterException implements ExceptionFilter {
  constructor() {}

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let errorException: ErrorException;

    if (exception instanceof ErrorException) {
      errorException = exception;
    } else {
      errorException = new ErrorException(
        'AN_UNKNOWN_ERROR|400',
        'An unknown error|400',
      );
    }

    response
      .status(errorException.httpStatusCode)
      .json(exception.returnError());
  }
}
