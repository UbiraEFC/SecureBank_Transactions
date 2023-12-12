/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';

import LoggerManager from '@src/utils/logger-manager';

interface InstanceConfig {
  baseUrl: string;
}

type ContentType = 'application/json' | 'application/x-www-form-urlencoded';

export class KeycloakInstance {
  private instance: AxiosInstance;

  constructor(config: InstanceConfig) {
    this.instance = this.createInstance(config);
    this.setInterceptors();
  }

  private createInstance(config: InstanceConfig): AxiosInstance {
    return axios.create({
      baseURL: config.baseUrl,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
      },
    });
  }

  private setInterceptors(): void {
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      (err: AxiosError) => {
        LoggerManager.log('keycloak-integration', {
          type: 'error',
          status: err.response && err.response.status,
          method: err.config.method,
          headers: err.config.headers,
          url: err.config.url,
          params: err.config.params,
          req_body: err.config && err.config.data,
          response: err.response ? err.response.data : err.message,
        });

        return Promise.reject(err);
      },
    );
  }

  getInstance(): AxiosInstance {
    return this.instance;
  }

  withAccessToken(accessToken: string): this {
    this.instance.defaults.headers.Authorization = `Bearer ${accessToken}`;
    return this;
  }

  withContentType(contentType: ContentType): this {
    const supportedContentTypes = ['application/json', 'application/x-www-form-urlencoded'];

    if (!supportedContentTypes.includes(contentType)) {
      throw new Error(`Tipo de conteúdo ${contentType} não suportado na integração do keycloak`);
    }

    this.instance.defaults.headers['Content-Type'] = contentType;
    return this;
  }

  resetContentType(): void {
    this.withContentType('application/json');
  }
}
