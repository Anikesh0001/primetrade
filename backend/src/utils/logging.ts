import { Request } from "express";

export const getRequestContext = (req: Request) => ({
  requestId: req.requestId ?? "-",
  method: req.method,
  path: req.originalUrl
});
