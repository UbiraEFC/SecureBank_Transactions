import crypto from 'crypto';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { inject } from 'inversify';
import { BaseHttpController, controller, httpGet, interfaces } from 'inversify-express-utils';

import ConstantsEnv from '@src/config/env/constants';
import { IHandshakeUseCase } from '@src/use-cases/security/handshake/handshake.interface';
import TYPES from '@src/utils/types';

@controller('/security')
export class SecurityController extends BaseHttpController implements interfaces.Controller {
  constructor(@inject(TYPES.HandshakeUseCase) private readonly handshakeUseCase: IHandshakeUseCase) {
    super();
  }

  @httpGet('/handshake')
  public async status(req: Request, res: Response): Promise<Response> {
    const response = await this.handshakeUseCase.execute({ frontendPublicKey: req.body.frontendPublicKey as string });

    return res.status(httpStatus.OK).json(response);
  }

  // TODO: Apply this method on the frontend
  @httpGet('/encrypt')
  public async encrypt(req: Request, res: Response): Promise<Response> {
    const data = req.body;

    const encrypted = crypto
      .publicEncrypt(
        {
          key: ConstantsEnv.backendPublicKey,
          padding: crypto.constants.RSA_PKCS1_PADDING,
        },
        Buffer.from(JSON.stringify(data)),
      )
      .toString('base64');

    return res.status(httpStatus.OK).json({ encrypted });
  }

  // TODO: Apply this method on the frontend
  @httpGet('/decrypt')
  public async decrypt(req: Request, res: Response): Promise<Response> {
    const encrypted = req.body.encrypted as string;

    const decrypted = crypto.privateDecrypt(
      {
        key: ConstantsEnv.frontendPrivateKey,
        padding: crypto.constants.RSA_PKCS1_PADDING,
      },
      Buffer.from(encrypted, 'base64'),
    );

    return res.status(httpStatus.OK).json(JSON.parse(decrypted.toString()));
  }
}
