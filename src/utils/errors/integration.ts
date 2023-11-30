import { AxiosError } from 'axios';
import { CustomError } from 'ts-custom-error';

type Service = 'identity-server/keycloak' | 'mail/sendInBlue';

export default class IntegrationError extends CustomError {
  service: string;
  isIntegrationError = true;
  errorCode: string;

  constructor(service: Service, err: AxiosError) {
    super(err.name);
    this.service = service;

    switch (service) {
      case 'identity-server/keycloak':
        this.errorCode = (err?.response?.data?.error as string) || err.message;
        this.message = (err?.response?.data?.error_description as string) || err.message;
        break;

      default:
        this.message = err.message;
        break;
    }
  }
}
