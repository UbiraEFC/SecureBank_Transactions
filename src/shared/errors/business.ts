import { CustomError } from 'ts-custom-error';

export default class BusinessError extends CustomError {
  code: string;
  options: { [key: string]: string | number | boolean };
  isBusinessError = true;

  constructor(code: string, options?: { [key: string]: string | number | boolean }) {
    super(code);
    this.code = code;
    this.options = options;
  }
}

export const BusinessErrorCodes = {
  // GENERAL
  ENTITY_NOT_FOUND: 'entity_not_found',

  // USER
  USER_NOT_FOUND: 'user_not_found',
  USER_ALREADY_EXISTS: 'user_already_exists',
  DOCUMENT_ALREADY_EXISTS: 'document_already_exists',
  EMAIL_ALREADY_EXISTS: 'email_already_exists',

  // Session
  INVALID_REFRESH_TOKEN: 'invalid_refresh_token',
  INVALID_PASSWORD: 'invalid_password',
  TEMPORARY_TOKEN_NOT_FOUND: 'temporary_token_not_found',
  REFRESH_TOKEN_EXPIRED: 'refresh_token_expired',

  // USER SECOND FACTOR KEY
  QRCODE_NOT_FOUND: 'qrcode_not_found',
  USER_SECOND_FACTOR_KEY_NOT_FOUND: 'user_second_factor_key_not_found',
  INVALID_TOTP_CODE: 'invalid_totp_code',

  // TRANSACTION
  INSUFFICIENT_BALANCE: 'insufficient_balance',
  ACCOUNT_NOT_FOUND: 'account_not_found',
  DESTINATION_ACCOUNT_NOT_FOUND: 'destination_account_not_found',
  SOURCE_AND_DESTINATION_ACCOUNT_ARE_THE_SAME: 'source_and_destination_account_are_the_same',
};
