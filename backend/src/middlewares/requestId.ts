import { Request, Response, NextFunction } from "express";
import { randomUUID } from "crypto";

export const requestIdMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const incoming = req.headers["x-request-id"];
  const requestId = typeof incoming === "string" ? incoming : randomUUID();
  req.requestId = requestId;
  res.setHeader("X-Request-Id", requestId);
  next();
};
