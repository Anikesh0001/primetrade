import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { AppError } from "../utils/errors";

interface TokenPayload {
  sub: string;
  email: string;
  role: string;
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new AppError("Unauthorized", 401));
  }

  const token = authHeader.replace("Bearer ", "").trim();

  try {
    const payload = jwt.verify(token, env.jwtAccessSecret) as TokenPayload;
    req.user = { id: payload.sub, email: payload.email, role: payload.role as never };
    return next();
  } catch (error) {
    return next(new AppError("Invalid or expired token", 401));
  }
};
