import { Router } from "express";
import { userController } from "../controllers/userController";
import { authMiddleware } from "../middlewares/auth";
import { roleMiddleware } from "../middlewares/role";
import { Role } from "@prisma/client";

export const userRoutes = Router();

/**
 * @openapi
 * /api/v1/users:
 *   get:
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     summary: List users (admin)
 *     responses:
 *       200:
 *         description: Users
 */
userRoutes.get("/", authMiddleware, roleMiddleware(Role.ADMIN), userController.list);
