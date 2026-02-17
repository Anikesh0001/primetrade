import { AnyZodObject } from "zod";
import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/errors";

export const validate = (schema: AnyZodObject) => (req: Request, res: Response, next: NextFunction) => {
  const result = schema.safeParse({
    body: req.body,
    params: req.params,
    query: req.query
  });

  if (!result.success) {
    return next(new AppError("Validation error", 400, result.error.flatten()));
  }

  Object.assign(req, result.data);
  return next();
};
