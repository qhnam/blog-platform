export enum ERROR_CODE {
  AN_UNKNOWN_ERROR = 'AN_UNKNOWN_ERROR|500',
  VALIDATION_ERROR = 'VALIDATION_ERROR|400',
  PATH_NOT_FOUND = 'PATH_NOT_FOUND|404',
  UNAUTHORIZED = 'UNAUTHORIZED|401',
  FORBIDDEN = 'FORBIDDEN|403',
  GENERATE_FILE_ERROR = 'GENERATE_FILE_ERROR_500|500',
  INVALID_JSON_FORMAT = 'INVALID_JSON_FORMAT|400',
  ALREADY_EXISTS = 'ALREADY_EXISTS',
  NOT_FOUND = 'NOT_FOUND',
}
