/*
  File: clientError.ts
  Author: yrfonfria@gmail.com
  Created at: 17/06/2024 07:15
  Copyright © 2024 Yosvel Reyes. All rights reserved
*/

export enum CustomCodes {
  BAD_URI = 101,
  REQUEST_ERROR = 102,
  BAD_OPERAND = 103,
  ZERO_DIVISION = 104,
}

export const ErrorMessages: Map<CustomCodes, string> = new Map([
  [CustomCodes.REQUEST_ERROR, 'Upstream responded with error'],
  [CustomCodes.BAD_OPERAND, 'Operands must be either a valid number or string representing a valid number'],
  [CustomCodes.ZERO_DIVISION, 'Division by 0 detected']
]);

export class ClientError {
  constructor(
    private _code: number,
    private _message?: string,
    private _originalError?: Error) {}
  public get code() { return this._code; }
  public get message() { return this._message || ''; }
  public get error() { return this._originalError; }
}
