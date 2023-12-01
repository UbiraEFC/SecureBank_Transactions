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
  USER_ALREADY_EXISTS: 'user_already_exists',
  DOCUMENT_ALREADY_EXISTS: 'document_already_exists',
  EMAIL_ALREADY_EXISTS: 'email_already_exists',
};
