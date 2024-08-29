import express, { Router } from 'express';
import httpClient, { HttpVerbs } from '../util/httpClient';
import { makeResponse } from '../util/makeResponse';
import config from 'config';

const router: Router = express.Router();
const apiUrl: URL = new URL(`${config.get('server.url')}/posts`);
const headers: Map<string, string> = new Map([['Content-Type', 'application/json']]);

router.get('', (_, res) => {
  res.setHeader('Content-Type', 'application/json');

  makeResponse(httpClient.fetch(apiUrl, {
    headers,
    method: HttpVerbs.GET
  }), res);
});

router.post('', (req, res) => {
  const body = req.body;
  res.setHeader('Content-Type', 'application/json');

  makeResponse(httpClient.fetch(apiUrl,
    {
      headers,
      method: HttpVerbs.POST
    },
    JSON.stringify(body),
  ), res);
});

export default router;
