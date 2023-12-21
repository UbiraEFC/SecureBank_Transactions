import { NextFunction, Request, Response } from 'express';

import { UserType } from '@src/models/enumerators/UsersEnum';
import ForbiddenError from '@src/shared/errors/forbidden';

import errorHandler from './errorHandler';

export function hasAccess(allowedTypes: UserType[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const { userType } = req.session;

      if (!allowedTypes.includes(userType)) {
        throw new ForbiddenError();
      }

      return next();
    } catch (err) {
      return errorHandler(err, req, res);
    }
  };
}
