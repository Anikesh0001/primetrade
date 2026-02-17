import jwt, { SignOptions } from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { env } from "../config/env";
import { Role } from "@prisma/client";

/**
 * JWT utilities for access and refresh tokens.
 */
export const tokenService = {
  signAccessToken: (payload: { id: string; email: string; role: Role }) => {
    const options: SignOptions = { expiresIn: env.jwtAccessExpiresIn as SignOptions["expiresIn"] };
    return jwt.sign({ sub: payload.id, email: payload.email, role: payload.role }, env.jwtAccessSecret, options);
  },
  signRefreshToken: (payload: { id: string; email: string; role: Role }) => {
    const options: SignOptions = { expiresIn: env.jwtRefreshExpiresIn as SignOptions["expiresIn"] };
    return jwt.sign({ sub: payload.id, email: payload.email, role: payload.role }, env.jwtRefreshSecret, options);
  },
  verifyRefreshToken: (token: string) => jwt.verify(token, env.jwtRefreshSecret) as { sub: string },
  hashToken: (token: string) => bcrypt.hash(token, 10),
  compareToken: (token: string, hash: string) => bcrypt.compare(token, hash)
};
