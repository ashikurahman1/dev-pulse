import type { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { sendError } from "../utils/response.js";


export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);

  const statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  const message = err.message || 'Something went wrong';

  return sendError(res, statusCode, message, err.error || null)
  
}