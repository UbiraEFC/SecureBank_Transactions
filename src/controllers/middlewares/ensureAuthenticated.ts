import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

import ConstantsEnv from '@src/config/env/constants';
import { UserType } from '@src/models/enumerators/UsersEnum';
import UnauthorizedError, { UnauthorizedErrorCodes } from '@src/shared/errors/unauthorized';

import errorHandler from './errorHandler';

interface Identity extends JwtPayload {
  userId: string;
  userType: UserType;
}

export function ensureAuthenticated(req: Request, res: Response, next: NextFunction): void {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) throw new UnauthorizedError(UnauthorizedErrorCodes.MISSING_TOKEN_HEADER);

    const [, token] = authHeader.split(' ');

    if (!token) throw new UnauthorizedError(UnauthorizedErrorCodes.MISSING_TOKEN);

    const decoded = jwt.verify(token, ConstantsEnv.jwtSecretToken) as Identity;

    req.session = {
      userId: decoded.sub,
      userType: decoded.userType,
      accessToken: token,
    };

    if (!req.session.userId) throw new UnauthorizedError(UnauthorizedErrorCodes.INVALID_TOKEN);

    return next();
  } catch (err) {
    throw errorHandler(new UnauthorizedError(err.message), req, res);
  }
}
