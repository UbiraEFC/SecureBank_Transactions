/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import crypto from 'crypto';
import { NextFunction, Request, Response } from 'express';

import ConstantsEnv from '@src/config/env/constants';
import BusinessError, { BusinessErrorCodes } from '@src/shared/errors/business';

import errorHandler from './errorHandler';

export function decrypt(req: Request, res: Response, next: NextFunction): void {
  try {
    const { encrypted } = req.body;

    if (!encrypted) throw new BusinessError(BusinessErrorCodes.MISSING_ENCRYPTED_DATA);

    const decrypted = crypto.privateDecrypt(
      {
        key: ConstantsEnv.backendPrivateKey,
        padding: crypto.constants.RSA_PKCS1_PADDING,
      },
      Buffer.from(encrypted, 'base64'),
    );

    req.body = JSON.parse(decrypted.toString());

    return next();
  } catch (err) {
    throw errorHandler(err, req, res);
  }
}
