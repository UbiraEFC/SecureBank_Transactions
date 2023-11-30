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
