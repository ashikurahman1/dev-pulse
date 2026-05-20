import type { NextFunction, Request, Response } from "express";
import { sendError } from "../utils/response.js";
import jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";
import envConfig from "../config/envConfig.js";


export interface AuthRequest extends Request {
  user?: {
    id: number;
    name: string;
    role: 'contributor' | 'maintainer'
  }
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if(!authHeader){
    return sendError(res, StatusCodes.UNAUTHORIZED, 'Authentication token missing');
  }

  const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader;

  if (!token) {
    return sendError(res, StatusCodes.UNAUTHORIZED, 'Authentication token missing');
  }

  try {
    const decoded = jwt.verify(token, envConfig.jwtSecret) as any;
    req.user = decoded;
    next();
    
  } catch (error) {
    return sendError(res, StatusCodes.UNAUTHORIZED, 'Invalid or expired token');
  }
}

export const authorize = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if(!req.user || !roles.includes(req.user.role)){
      return sendError(res, StatusCodes.FORBIDDEN, 'Insufficient role permissions to access this resource');
    }
    next();
  }
}