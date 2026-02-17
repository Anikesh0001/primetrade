import { Request, Response } from "express";
import { authService } from "../services/authService";
import { response } from "../utils/response";
import { asyncHandler } from "../utils/asyncHandler";
import { tokenService } from "../services/tokenService";
import { Messages } from "../utils/messages";
import { AppError } from "../utils/errors";

/**
 * Auth HTTP handlers.
 */
export const authController = {
  register: asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body as { email: string; password: string };
    const result = await authService.register(email, password);

    res.status(201).json(
      response(
        {
          user: { id: result.user.id, email: result.user.email, role: result.user.role },
          accessToken: result.accessToken,
          refreshToken: result.refreshToken
        },
        Messages.auth.registrationSuccess
      )
    );
  }),
  login: asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body as { email: string; password: string };
    const result = await authService.login(email, password);

    res.json(
      response(
        {
          user: { id: result.user.id, email: result.user.email, role: result.user.role },
          accessToken: result.accessToken,
          refreshToken: result.refreshToken
        },
        Messages.auth.loginSuccess
      )
    );
  }),
  refresh: asyncHandler(async (req: Request, res: Response) => {
    const { refreshToken } = req.body as { refreshToken: string };
    let payload: { sub: string };
    try {
      payload = tokenService.verifyRefreshToken(refreshToken);
    } catch {
      throw new AppError("Invalid or expired refresh token", 401);
    }
    const result = await authService.refresh(payload.sub, refreshToken);

    res.json(response(result, Messages.auth.refreshSuccess));
  }),
  logout: asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id as string;
    await authService.logout(userId);
    res.json(response({}, Messages.auth.logoutSuccess));
  })
};
