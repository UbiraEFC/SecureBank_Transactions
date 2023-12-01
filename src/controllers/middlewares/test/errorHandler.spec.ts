import { Request, Response } from 'express';
import { Result, ValidationError } from 'express-validator';
import httpStatus from 'http-status';
import { createRequest, createResponse } from 'node-mocks-http';
import { beforeEach, describe, expect, it } from 'vitest';

import { ISession } from '@src/models/DTOs/session';
import BusinessError, { BusinessErrorCodes } from '@src/utils/errors/business';
import ForbiddenError from '@src/utils/errors/forbidden';
import UnauthorizedError from '@src/utils/errors/unauthorized';
import { ValidateError } from '@src/utils/errors/validate';

import errorHandler from '../errorHandler';

let responseMock: Response;
let requestMock: Request;
let session: ISession;

describe('error handler test', () => {
  beforeEach(() => {
    responseMock = createResponse();
    process.env.DEBUG = 'true';
  });
  it('should return 400 when error is instance of BusinessError', async () => {
    requestMock = createRequest({
      session,
      headers: {},
    });

    errorHandler(new BusinessError(BusinessErrorCodes.ENTITY_NOT_FOUND), requestMock, responseMock);
    expect(responseMock.statusCode).toBe(httpStatus.BAD_REQUEST);
  });

  it('should return 403 when error is instance of ForbiddenError', async () => {
    requestMock = createRequest({
      session,
      headers: {},
    });

    errorHandler(new ForbiddenError(), requestMock, responseMock);
    expect(responseMock.statusCode).toBe(httpStatus.FORBIDDEN);
  });

  it('should return 401 when error is instance of UnauthorizedError', async () => {
    requestMock = createRequest({
      session,
      headers: {},
    });

    errorHandler(new UnauthorizedError(), requestMock, responseMock);
    expect(responseMock.statusCode).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should return 400 when error is instance of ValidateError', async () => {
    requestMock = createRequest({
      session,
      headers: {},
    });

    const error: Result<ValidationError> = {
      errors: [
        {
          location: 'body',
          msg: 'Invalid value',
          param: 'name',
          value: 'invalid',
        },
      ],
      array: () => [],
      isEmpty: () => false,
      mapped: () => ({}),
      formatter: () => ({}),
      throw: () => ({}),
      // @ts-expect-error: it is only a mock to test the error handler
      formatWith: () => ({}),
    };

    errorHandler(new ValidateError(error), requestMock, responseMock);
    expect(responseMock.statusCode).toBe(httpStatus.BAD_REQUEST);
  });
});
