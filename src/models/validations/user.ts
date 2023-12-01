import { ParamSchema, Schema } from 'express-validator';

import { isValidCPF } from '@src/utils/document-validator';
import { ValidationErrorCodes } from '@src/utils/errors/validate';
import { validEmailRegex, validUserNameRegex } from '@src/utils/regex';

import { UserType, UserTypeArray } from '../enumerators/UsersEnum';

const nameRules: ParamSchema = {
  in: 'body',
  isString: { bail: true },
  isLength: {
    options: { min: 1, max: 60 },
    bail: true,
    errorMessage: ValidationErrorCodes.INVALID_NAME_LENGTH,
  },
  custom: {
    options: (name) => validUserNameRegex.test(name),
  },
  errorMessage: ValidationErrorCodes.INVALID_NAME_FORMAT,
};

const emailRules: ParamSchema = {
  in: 'body',
  isString: { bail: true },
  custom: {
    options: (email: string) => {
      return validEmailRegex.test(email);
    },
    bail: true,
  },
  customSanitizer: {
    options: (email: string) => email.toLowerCase(),
  },
  errorMessage: ValidationErrorCodes.INVALID_EMAIL_FORMAT,
};

const documentRules: ParamSchema = {
  in: 'body',
  isString: true,
  isLength: {
    options: { min: 11, max: 14 },
    bail: true,
  },
  custom: {
    options: (document) => isValidCPF(document),
  },
  errorMessage: ValidationErrorCodes.INVALID_DOCUMENT_FORMAT,
  customSanitizer: {
    options: (document: string) => document.replace(/[^\d]+/g, ''),
  },
};

const userType: ParamSchema = {
  in: 'body',
  isString: { bail: true },
  notEmpty: { bail: true },
  custom: {
    options: (typePast: UserType) => UserTypeArray.includes(typePast),
  },
  errorMessage: ValidationErrorCodes.INVALID_USER_TYPE_FORMAT,
};

export const CreateUserInput: Schema = {
  name: { ...nameRules },
  email: { ...emailRules },
  document: { ...documentRules },
  userType: { ...userType },
};
