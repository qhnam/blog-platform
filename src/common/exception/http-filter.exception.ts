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
import { LogErrorService } from 'src/modules/log-error/services/log-error.service';

@Catch()
export class HttpFilterException implements ExceptionFilter {
  constructor(private readonly logErrorService: LogErrorService) {}

  async catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

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

      await this.logErrorService.create({
        errorCode: exception.errorCode ?? '',
        message: exception.message,
        stackTrade: exception.stack ?? '',
        path: request?.url,
        method: request?.method,
      });
    }
    console.log('e', exception);
    response
      .status(errorException.httpStatusCode)
      .json(errorException.returnError());
  }
}
