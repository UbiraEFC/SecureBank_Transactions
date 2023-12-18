import { Result, ValidationError } from 'express-validator';
import { CustomError } from 'ts-custom-error';

export class ValidateError extends CustomError {
  public readonly message: string;
  public readonly validation: Result<ValidationError>;
  isValidationError = true;

  constructor(validation: Result<ValidationError>, message?: string) {
    super();
    this.validation = validation;
    this.message = message;
  }
}

export const ValidationErrorCodes = {
  // USER
  INVALID_NAME_LENGTH: 'invalid-name-length',
  INVALID_NAME_FORMAT: 'invalid-name-format',
  INVALID_EMAIL_FORMAT: 'invalid-email-format',
  INVALID_DOCUMENT_FORMAT: 'invalid-document-format',
  INVALID_USER_TYPE_FORMAT: 'invalid-userType-format',
};
