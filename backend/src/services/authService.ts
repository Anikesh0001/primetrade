import bcrypt from "bcryptjs";
import { Role } from "@prisma/client";
import { userRepository } from "../repositories/userRepository";
import { tokenService } from "./tokenService";
import { AppError } from "../utils/errors";

/**
 * Authentication domain services.
 */
export const authService = {
  register: async (email: string, password: string) => {
    const existing = await userRepository.findByEmail(email);
    if (existing) {
      throw new AppError("Email already in use", 409);
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await userRepository.create({ email, passwordHash, role: Role.USER });

    const accessToken = tokenService.signAccessToken({ id: user.id, email: user.email, role: user.role });
    const refreshToken = tokenService.signRefreshToken({ id: user.id, email: user.email, role: user.role });
    const refreshTokenHash = await tokenService.hashToken(refreshToken);

    await userRepository.updateRefreshToken(user.id, refreshTokenHash);

    return { user, accessToken, refreshToken };
  },
  login: async (email: string, password: string) => {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new AppError("Invalid credentials", 401);
    }

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      throw new AppError("Invalid credentials", 401);
    }

    const accessToken = tokenService.signAccessToken({ id: user.id, email: user.email, role: user.role });
    const refreshToken = tokenService.signRefreshToken({ id: user.id, email: user.email, role: user.role });
    const refreshTokenHash = await tokenService.hashToken(refreshToken);

    await userRepository.updateRefreshToken(user.id, refreshTokenHash);

    return { user, accessToken, refreshToken };
  },
  refresh: async (userId: string, refreshToken: string) => {
    const user = await userRepository.findById(userId);
    if (!user || !user.refreshTokenHash) {
      throw new AppError("Unauthorized", 401);
    }

    const valid = await tokenService.compareToken(refreshToken, user.refreshTokenHash);
    if (!valid) {
      throw new AppError("Unauthorized", 401);
    }

    const accessToken = tokenService.signAccessToken({ id: user.id, email: user.email, role: user.role });
    const newRefreshToken = tokenService.signRefreshToken({ id: user.id, email: user.email, role: user.role });
    const refreshTokenHash = await tokenService.hashToken(newRefreshToken);

    await userRepository.updateRefreshToken(user.id, refreshTokenHash);

    return { accessToken, refreshToken: newRefreshToken };
  },
  logout: async (userId: string) => {
    await userRepository.updateRefreshToken(userId, null);
  }
};
