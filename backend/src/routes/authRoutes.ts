import { Router } from "express";
import { authController } from "../controllers/authController";
import { validate } from "../middlewares/validate";
import { authMiddleware } from "../middlewares/auth";
import { loginSchema, refreshSchema, registerSchema } from "../modules/auth/auth.validation";

export const authRoutes = Router();

/**
 * @openapi
 * /api/v1/auth/register:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       201:
 *         description: Registered
 */
authRoutes.post("/register", validate(registerSchema), authController.register);

/**
 * @openapi
 * /api/v1/auth/login:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Logged in
 */
authRoutes.post("/login", validate(loginSchema), authController.login);

/**
 * @openapi
 * /api/v1/auth/refresh:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Refresh token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RefreshRequest'
 *     responses:
 *       200:
 *         description: Token refreshed
 */
authRoutes.post("/refresh", validate(refreshSchema), authController.refresh);

/**
 * @openapi
 * /api/v1/auth/logout:
 *   post:
 *     tags:
 *       - Auth
 *     security:
 *       - bearerAuth: []
 *     summary: Logout
 *     responses:
 *       200:
 *         description: Logged out
 */
authRoutes.post("/logout", authMiddleware, authController.logout);
