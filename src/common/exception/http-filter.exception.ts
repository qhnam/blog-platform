import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ErrorException } from './error.exception';
import { Response } from 'express';
import { ERROR_CODE } from '../enum/error-code.enum';

@Catch()
export class HttpFilterException implements ExceptionFilter {
  constructor() {}

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let errorException: ErrorException;

    if (exception instanceof ErrorException) {
      errorException = exception;
    } else if (exception instanceof NotFoundException) {
      errorException = new ErrorException(
        ERROR_CODE.PATH_NOT_FOUND,
        'Path not found',
      );
    } else if (exception instanceof UnauthorizedException) {
      errorException = new ErrorException(
        ERROR_CODE.UNAUTHORIZED,
        'Unauthorized',
      );
    } else if (exception instanceof BadRequestException) {
      errorException = new ErrorException(
        ERROR_CODE.INVALID_JSON_FORMAT,
        'Invalid json format',
      );
    } else {
      errorException = new ErrorException(
        ERROR_CODE.AN_UNKNOWN_ERROR,
        'An unknown error',
      );
    }

    response
      .status(errorException.httpStatusCode)
      .json(errorException.returnError());
  }
}
