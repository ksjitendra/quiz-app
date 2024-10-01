import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { ResponseObject } from './utils.interface';

@Injectable()
export class UtilsService {
  constructor(
  ) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sendResponse(res: Response, statusCode: number, data: any, message: string, error?: any, errorCode?: any): any {
    const responseObject: ResponseObject = {
      statusCode,
      message,
      data,
      error,
      errorCode: errorCode,
    };
    if (error) {
      responseObject['error'] = error;
    }
    return res.status(statusCode).json(responseObject);
  }

  
}
