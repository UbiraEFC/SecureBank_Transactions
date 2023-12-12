import { injectable } from 'inversify';
import { authenticator } from 'otplib';

import { IOneTimePasswordProvider } from '../../interfaces/one-time-password.interface';

@injectable()
export class OTPLibProvider implements IOneTimePasswordProvider {
  generateKeyURI(accountName: string, issuer: string, secret: string): string {
    return authenticator.keyuri(accountName, issuer, secret);
  }

  verifyToken(token: string, secret: string): boolean {
    this.loadOptions();
    return authenticator.verify({ token, secret });
  }

  generateToken(secret: string): string {
    this.loadOptions();
    const token = authenticator.generate(secret);

    return token;
  }

  generateBase32Key(): string {
    this.loadOptions();
    return authenticator.generateSecret();
  }

  private loadOptions(): void {
    authenticator.resetOptions();
    authenticator.options = {
      ...authenticator.options,
      digits: 6,
      step: 30,
      window: 5,
      epoch: Date.now(),
    };
  }
}
