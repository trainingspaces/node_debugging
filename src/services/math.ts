/*
  File: math.ts
  Author: yrfonfria@gmail.com
  Created at: 17/06/2024 07:13
  Copyright © 2024 Yosvel Reyes. All rights reserved
*/

import express, { Response, Router } from "express";
import { makeError } from "../util/makeResponse";
import { CustomCodes } from "../util/clientError";
import { StatusCodes } from "http-status-codes";

type InputOperand = number | string;
type Tuple = { a: number, b: number };

const router: Router = express.Router();

const buildResponse = (
  response: Response,
  a: number,
  b: number,
  result: number,
  operation: string) => {
    response.setHeader('Content-Type', 'application/json');
    response.json({ message: `${a} ${operation} ${b} = ${result}`});
}

const buildErrorResponse = (r: Response, code: CustomCodes, status: StatusCodes) => {
  r.setHeader('Content-Type', 'application/json');
  r.status(status);
  r.json(makeError(code));
}

const REGEX = /^\d+(\.\d+)?$/;

const validate  = (a: InputOperand, b: InputOperand): boolean => (REGEX.test(`${a}`) && REGEX.test(`${b}`));
const parse = (a: InputOperand, b: InputOperand): Tuple => {
  const obj = { a: 0, b: 0 };

  const convert = (value: string): number => /\./.test(value) ? parseFloat(value) : parseInt(value, 10);

  obj.a = (typeof a !== 'number') ? convert(a) : a;
  obj.b = (typeof b !== 'number') ? convert(b) : b;

  return obj;
}

router.post('/add', (req, res) => {
  const {a, b} = req.body;
  if (validate(a, b)) {
    const { a:x, b:y } = parse(a, b);
    buildResponse(res, x, y, x + y, '+');
  } else {
    buildErrorResponse(res, CustomCodes.BAD_OPERAND, StatusCodes.BAD_REQUEST);
  }

  res.end();
});

router.post('/sub', (req, res) => {
  const {a, b} = req.body;
  if (validate(a, b)) {
    const { a:x, b:y } = parse(a, b);
    buildResponse(res, x, y, x - y, '-');
  } else {
    buildErrorResponse(res, CustomCodes.BAD_OPERAND, StatusCodes.BAD_REQUEST);
  }

  res.end();
});

router.post('/mul', (req, res) => {
  const {a, b} = req.body;
  if (validate(a, b)) {
    const { a:x, b:y } = parse(a,b);
    buildResponse(res, x, y, x * y, '*');
  } else {
    buildErrorResponse(res, CustomCodes.BAD_OPERAND, StatusCodes.BAD_REQUEST);
  }

  res.end();
});

router.post('/div', (req, res) => {
  const {a, b} = req.body;
  if (validate(a, b) && `${b}` !== '0') {
    const { a:x, b:y } = parse(a, b);
    buildResponse(res, x, y, x / y, '/');
  } else {
    if (`${b}` === '0') {
      buildErrorResponse(res, CustomCodes.ZERO_DIVISION, StatusCodes.BAD_REQUEST);
    } else {
      buildErrorResponse(res, CustomCodes.BAD_OPERAND, StatusCodes.BAD_REQUEST);
    }
  }

  res.end();
});

export default router;
