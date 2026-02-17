import { Request, Response, NextFunction } from "express";
import { Role } from "@prisma/client";
import { AppError } from "../utils/errors";

export const roleMiddleware = (...roles: Role[]) => (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return next(new AppError("Unauthorized", 401));
  }

  if (!roles.includes(req.user.role)) {
    return next(new AppError("Forbidden", 403));
  }

  return next();
};
