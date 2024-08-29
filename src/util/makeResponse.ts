/*
  File: makeResponse.ts
  Author: yrfonfria@gmail.com
  Created at: 17/06/2024 07:15
  Copyright © 2024 Yosvel Reyes. All rights reserved
*/

import { Response } from "express";
import { StatusCodes } from "http-status-codes";
import { CustomCodes, ErrorMessages } from "./clientError";
import { logger } from "./logger";

export const makeError = (code: CustomCodes): Object => {
  const error = ErrorMessages.get(code);
  return { code, error };
};

export const makeResponse = (promise: Promise<any>, res: Response): void => {
  promise
    .then(response => {
      res.status(StatusCodes.OK);
      res.send(response);
    })
    .catch(e => {
      logger.error(e.message);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR);
      res.json(makeError(e.code));
    })
    .finally(() => res.end())
};

