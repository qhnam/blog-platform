export class SuccessResponse {
  static call(data: any = null, message = 'Successfully') {
    return {
      result: true,
      message,
      data,
      errorCode: null,
    };
  }
}
