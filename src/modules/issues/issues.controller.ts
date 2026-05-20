import type { NextFunction, Response } from "express";
import type { AuthRequest } from "../../middleware/auth.middleware.js";
import * as issuesService from './issues.service.js';
import { sendSuccess } from "../../utils/response.js";
import { StatusCodes } from "http-status-codes";

export const createIssue = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const issue = await issuesService.createIssue(req.body, req.user!.id);
    return sendSuccess(res, StatusCodes.CREATED, 'Issue created successfully', issue);
  } catch (error) {
    next(error);
  }
}