import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/errors";
import { logger } from "../config/logger";
import { getRequestContext } from "../utils/logging";

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err instanceof AppError ? err.statusCode : 500;
  const message = err.message || "Internal Server Error";
  const details = err instanceof AppError ? err.details : undefined;

  const context = getRequestContext(req);
  logger.error(`${context.method} ${context.path} - ${message} - ${context.requestId}`);

  res.status(statusCode).json({
    success: false,
    message,
    data: null,
    ...(details ? { details } : {})
  });
};
