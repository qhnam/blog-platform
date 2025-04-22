import { EMAIL_TYPE } from '../enums';

type TBaseData = {
  otp: string | null;
};

export type TEmailVerify = TBaseData & {
  fullname: string;
};

export type ISendMailInput = {
  to: string;
  type: EMAIL_TYPE;
  data: TEmailVerify | TBaseData;
};
