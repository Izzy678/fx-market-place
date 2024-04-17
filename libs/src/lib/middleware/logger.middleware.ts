import { Logger } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

export const logCalledRequest = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const timestamp = new Date().toISOString();

  // Extract relevant information from the request object
  const { method, query, body,baseUrl,headers,protocol } = req;

  // Log the request in a standardized format
  Logger.log(
    `${method} ${protocol}://${headers.host}${baseUrl} - Query: ${JSON.stringify(query)}, Body: ${JSON.stringify(body)}]`,
  );
  next();
};
