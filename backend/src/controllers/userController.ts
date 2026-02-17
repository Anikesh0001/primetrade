import { Request, Response } from "express";
import { userService } from "../services/userService";
import { response } from "../utils/response";
import { asyncHandler } from "../utils/asyncHandler";
import { Messages } from "../utils/messages";

/**
 * User HTTP handlers (admin only).
 */
export const userController = {
  list: asyncHandler(async (req: Request, res: Response) => {
    const { page, limit } = req.query as { page?: string; limit?: string };
    const result = await userService.list(page ? Number(page) : undefined, limit ? Number(limit) : undefined);
    res.json(response(result, Messages.users.fetched));
  })
};
