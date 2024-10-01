/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ResponseObject {
    statusCode: number;
    message: string;
    data: any;
    error?: any;
    errorCode?: any;
  }
  
  export interface IfunctionReturnObject {
    status: number;
    data: any;
    message: string;
    error?: any;
    errorCode?: any;
  }
  