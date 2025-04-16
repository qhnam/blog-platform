export class ErrorException extends Error {
  public readonly errorCode: string;
  public readonly data: any;
  public readonly httpStatusCode: number;

  constructor(code: string, message: string, data: any = null) {
    super(message);

    const [errorCode, httpStatusCode] = code.split('|');
    this.errorCode = errorCode;
    this.httpStatusCode = httpStatusCode ? Number(httpStatusCode) : 400;
    this.data = data;
  }

  returnError() {
    return {
      result: false,
      message: this.message,
      errorCode: this.errorCode,
      data: this.data,
    };
  }
}
