/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Request, Response } from 'express';
import httpStatus from 'http-status';

import ConstantsEnv from '@src/config/env/constants';
import BusinessError from '@src/shared/errors/business';
import ForbiddenError from '@src/shared/errors/forbidden';
import IntegrationError from '@src/shared/errors/integration';
import UnauthorizedError from '@src/shared/errors/unauthorized';
import { ValidateError } from '@src/shared/errors/validate';

import LoggerManager from '@utils/logger-manager';
import { logError } from '@utils/logs';

export default function errorHandler(
  err: BusinessError | IntegrationError | ForbiddenError | UnauthorizedError | ValidateError | Error,
  req: Request,
  res: Response,
): void {
  if (err instanceof BusinessError && err.isBusinessError) {
    res.status(httpStatus.BAD_REQUEST).json({
      error: err.code,
      options: err.options,
    });
  } else if ((err instanceof UnauthorizedError && err.isUnauthorizedError) || err.name === 'TokenExpiredError') {
    res.status(httpStatus.UNAUTHORIZED).json({
      error: 'Unauthorized',
      message: err.message,
    });
  } else if (err instanceof ForbiddenError && err.isForbiddenError) {
    res.sendStatus(httpStatus.FORBIDDEN);
  } else if (err instanceof ValidateError && err.isValidationError) {
    res.status(httpStatus.BAD_REQUEST).json({
      isValidationError: err.isValidationError,
      errors: err.validation.array({ onlyFirstError: true }),
    });
  } else {
    LoggerManager.log('application', {
      err,
      type: 'error',
      origin: 'api',
      req: {
        requestId: req.headers['X-Request-ID'],
        originalUrl: req.originalUrl,
        baseUrl: req.baseUrl,
        method: req.method,
        urlPath: req.path,
        urlQuery: req.query,
        body: req.body,
        session: req.session,
        headers: req.headers,
      },
    });

    if (ConstantsEnv.env !== 'production') {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ stack: err.stack, message: err.message, ...err });
    } else {
      res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
    }

    logError(err.message, err.stack);
  }
}
