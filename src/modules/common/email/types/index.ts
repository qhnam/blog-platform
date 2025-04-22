import { EMAIL_TYPE } from '../enums';

type BaseDataType = {
  otp: string;
};

export type ISendMailInput = {
  to: string;
  type: EMAIL_TYPE;
  data: BaseDataType;
};
