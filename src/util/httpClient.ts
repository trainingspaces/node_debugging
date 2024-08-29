/*
  File: httpClient.ts
  Author: yrfonfria@gmail.com
  Created at: 17/06/2024 07:15
  Copyright © 2024 Yosvel Reyes. All rights reserved
*/

import http, { ClientRequest } from 'node:http';
import https from 'node:https';
import { ClientError, CustomCodes } from './clientError';
import { URL } from 'node:url';
import { logger } from './logger';

const DEFAULT_HTTP_PORT = 80;
const DEFAULT_HTTPS_PORT = 443;
const HTTP_PROTO = 'http:';
const HTTPS_PROTO = 'https:';

export enum HttpVerbs {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
};

export interface IFetchOptions {
  method: HttpVerbs
  headers: Map<string, string>
}

export interface IClient {
  fetch(uri: URL, options: IFetchOptions): Promise<string>;
}

class Client implements IClient {

  public async fetch(url: URL, options: IFetchOptions, data?: string | Object): Promise<string> {

    let cli = undefined;

    // Will handle only these protocols.
    switch(true) {
      case (url.protocol === HTTP_PROTO):
        cli = http;
        break;
      case (url.protocol === HTTPS_PROTO):
        cli = https;
        break;
      default:
        throw new ClientError(CustomCodes.BAD_URI, `The uri ${url} is not a valid uri`);
    }

    return new Promise((resolve, reject) => {

      const opts = {
         hostname:  url.hostname,
         port: url.port || url.protocol === HTTP_PROTO ? DEFAULT_HTTP_PORT : DEFAULT_HTTPS_PORT,
         headers: Object.fromEntries(options.headers),
         path: url.pathname + url.search || '',
         method: options.method
      }

      const req: ClientRequest = cli?.request(opts, (res) => {

        let acc: string = '';
        res.on('data', (chunk: Buffer | string)  => {
          acc += chunk.toString();
        });

        res.on('end', () => resolve(acc));

      });

      req.on('error', (e: Error) => {
        logger.error(e);
        reject(new ClientError(CustomCodes.REQUEST_ERROR, 'server responded with error', e));
      });

      if ([ HttpVerbs.POST, HttpVerbs.PUT, HttpVerbs.PATCH ].includes(options.method) && data) {
        const payload: string | undefined =  typeof data === 'string' ? data :  JSON.stringify(data);
        logger.info(`Sending payload ${payload}`);
        req.write(payload || '');
      }

      req.end();
    });
  }
}

export default new Client();
