import { Router } from "express";
import { projectController } from "../controllers/projectController";
import { authMiddleware } from "../middlewares/auth";
import { validate } from "../middlewares/validate";
import {
  projectCreateSchema,
  projectIdSchema,
  projectListSchema,
  projectUpdateSchema
} from "../modules/projects/project.validation";

export const projectRoutes = Router();

/**
 * @openapi
 * /api/v1/projects:
 *   post:
 *     tags:
 *       - Projects
 *     security:
 *       - bearerAuth: []
 *     summary: Create project
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProjectCreateRequest'
 *     responses:
 *       201:
 *         description: Created
 */
projectRoutes.post("/", authMiddleware, validate(projectCreateSchema), projectController.create);

/**
 * @openapi
 * /api/v1/projects:
 *   get:
 *     tags:
 *       - Projects
 *     security:
 *       - bearerAuth: []
 *     summary: List projects
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [ACTIVE, COMPLETED, ARCHIVED]
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Projects
 */
projectRoutes.get("/", authMiddleware, validate(projectListSchema), projectController.list);

/**
 * @openapi
 * /api/v1/projects/{id}:
 *   get:
 *     tags:
 *       - Projects
 *     security:
 *       - bearerAuth: []
 *     summary: Get project by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Project
 */
projectRoutes.get("/:id", authMiddleware, validate(projectIdSchema), projectController.getById);

/**
 * @openapi
 * /api/v1/projects/{id}:
 *   put:
 *     tags:
 *       - Projects
 *     security:
 *       - bearerAuth: []
 *     summary: Update project
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProjectUpdateRequest'
 *     responses:
 *       200:
 *         description: Updated
 */
projectRoutes.put("/:id", authMiddleware, validate(projectUpdateSchema), projectController.update);

/**
 * @openapi
 * /api/v1/projects/{id}:
 *   delete:
 *     tags:
 *       - Projects
 *     security:
 *       - bearerAuth: []
 *     summary: Delete project
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Deleted
 */
projectRoutes.delete("/:id", authMiddleware, validate(projectIdSchema), projectController.remove);
