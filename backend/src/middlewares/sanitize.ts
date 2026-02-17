import { Request, Response, NextFunction } from "express";
import xss from "xss";

const sanitizeValue = (value: unknown): unknown => {
  if (typeof value === "string") {
    return xss(value.trim());
  }
  if (Array.isArray(value)) {
    return value.map(sanitizeValue);
  }
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, val]) => [key, sanitizeValue(val)])
    );
  }
  return value;
};

export const sanitizeInput = (req: Request, res: Response, next: NextFunction) => {
  req.body = sanitizeValue(req.body);
  req.query = sanitizeValue(req.query) as typeof req.query;
  req.params = sanitizeValue(req.params) as typeof req.params;
  next();
};
