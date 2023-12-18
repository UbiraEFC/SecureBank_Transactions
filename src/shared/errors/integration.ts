import { AxiosError } from 'axios';
import { CustomError } from 'ts-custom-error';

type Service = 'otp/otplib' | 'storage/local' | 'qrcode';

export default class IntegrationError extends CustomError {
  service: string;
  isIntegrationError = true;
  errorCode: string;

  constructor(service: Service, err: AxiosError) {
    super(err.name);
    this.service = service;
    this.message = err.message;
  }
}
