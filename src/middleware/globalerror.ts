// middleware/globalerror.ts
import { Request, Response, NextFunction } from 'express';
import { HttpError } from 'http-errors';

const globalErroHandler = (
  err: HttpError, 
  req: Request, 
  res: Response, 
  next: NextFunction
) => 
  {
  // Error handling logic
  const statusCode = err.status || 500;
  const message = err.message || 'Something went wrong';
  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
};
export default globalErroHandler;