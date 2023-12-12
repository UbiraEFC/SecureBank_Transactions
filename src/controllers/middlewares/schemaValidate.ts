import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';

import { ValidateError } from '@src/shared/errors/validate';

import errorHandler from './errorHandler';

function schemaValidate() {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        throw new ValidateError(errors);
      }

      return next();
    } catch (err) {
      return errorHandler(err, req, res);
    }
  };
}

export default schemaValidate;
