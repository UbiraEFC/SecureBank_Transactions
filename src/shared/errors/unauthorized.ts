import { CustomError } from 'ts-custom-error';

export default class UnauthorizedError extends CustomError {
  isUnauthorizedError = true;
}

export const UnauthorizedErrorCodes = {
  UNAUTHORIZED: 'unauthorized',
  MISSING_TOKEN_HEADER: 'missing_token_header',
  MISSING_TOKEN: 'missing_token',
  INVALID_TOKEN: 'invalid_token',
};
