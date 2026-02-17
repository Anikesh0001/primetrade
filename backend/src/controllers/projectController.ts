import { Request, Response } from "express";
import { projectService } from "../services/projectService";
import { response } from "../utils/response";
import { asyncHandler } from "../utils/asyncHandler";
import { ProjectStatus, Role } from "@prisma/client";
import { Messages } from "../utils/messages";

/**
 * Project HTTP handlers.
 */
export const projectController = {
  create: asyncHandler(async (req: Request, res: Response) => {
    const { title, description, status } = req.body as {
      title: string;
      description: string;
      status?: ProjectStatus;
    };
    const project = await projectService.create({ title, description, status }, req.user!.id);
    res.status(201).json(response(project, Messages.projects.created));
  }),
  list: asyncHandler(async (req: Request, res: Response) => {
    const { status, search, page, limit } = req.query as {
      status?: ProjectStatus;
      search?: string;
      page?: string;
      limit?: string;
    };

    const result = await projectService.list(
      { status, search },
      page ? Number(page) : undefined,
      limit ? Number(limit) : undefined,
      req.user!.id,
      req.user!.role as Role
    );

    res.json(response(result, Messages.projects.fetched));
  }),
  getById: asyncHandler(async (req: Request, res: Response) => {
    const project = await projectService.getById(req.params.id, req.user!.id, req.user!.role as Role);
    res.json(response(project, Messages.projects.fetchedSingle));
  }),
  update: asyncHandler(async (req: Request, res: Response) => {
    const { title, description, status } = req.body as {
      title?: string;
      description?: string;
      status?: ProjectStatus;
    };
    const project = await projectService.update(
      req.params.id,
      { title, description, status },
      req.user!.id,
      req.user!.role as Role
    );
    res.json(response(project, Messages.projects.updated));
  }),
  remove: asyncHandler(async (req: Request, res: Response) => {
    const project = await projectService.remove(req.params.id, req.user!.id, req.user!.role as Role);
    res.json(response(project, Messages.projects.removed));
  })
};
