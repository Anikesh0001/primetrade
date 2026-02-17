import { ProjectStatus, Role } from "@prisma/client";
import { projectRepository } from "../repositories/projectRepository";
import { AppError } from "../utils/errors";
import { getPagination } from "../utils/pagination";
import { redis } from "../config/redis";

interface ProjectFilters {
  status?: ProjectStatus;
  search?: string;
}

const cacheKey = (ownerId: string | undefined, role: Role, filters: ProjectFilters, page: number, limit: number) =>
  `projects:${role}:${ownerId ?? "all"}:${filters.status ?? "all"}:${filters.search ?? ""}:${page}:${limit}`;

/**
 * Project domain services with ownership enforcement.
 */
export const projectService = {
  create: async (payload: { title: string; description: string; status?: ProjectStatus }, userId: string) => {
    return projectRepository.create({ ...payload, ownerId: userId });
  },
  list: async (filters: ProjectFilters, page: number | undefined, limit: number | undefined, userId: string, role: Role) => {
    const { currentPage, perPage, skip } = getPagination(page, limit);
    const ownerId = role === Role.ADMIN ? undefined : userId;
    const key = cacheKey(ownerId, role, filters, currentPage, perPage);

    const cached = await redis.get(key);
    if (cached) {
      return JSON.parse(cached);
    }

    const [items, total] = await Promise.all([
      projectRepository.list({ ...filters, ownerId }, skip, perPage),
      projectRepository.count({ ...filters, ownerId })
    ]);

    const result = {
      items,
      meta: {
        total,
        page: currentPage,
        limit: perPage,
        pages: Math.ceil(total / perPage)
      }
    };

    await redis.set(key, JSON.stringify(result), "EX", 60);

    return result;
  },
  getById: async (id: string, userId: string, role: Role) => {
    const project = await projectRepository.findById(id);
    if (!project) {
      throw new AppError("Project not found", 404);
    }
    if (role !== Role.ADMIN && project.ownerId !== userId) {
      throw new AppError("Forbidden", 403);
    }
    return project;
  },
  update: async (id: string, payload: { title?: string; description?: string; status?: ProjectStatus }, userId: string, role: Role) => {
    const project = await projectRepository.findById(id);
    if (!project) {
      throw new AppError("Project not found", 404);
    }
    if (role !== Role.ADMIN && project.ownerId !== userId) {
      throw new AppError("Forbidden", 403);
    }
    return projectRepository.update(id, payload);
  },
  remove: async (id: string, userId: string, role: Role) => {
    const project = await projectRepository.findById(id);
    if (!project) {
      throw new AppError("Project not found", 404);
    }
    if (role !== Role.ADMIN && project.ownerId !== userId) {
      throw new AppError("Forbidden", 403);
    }
    return projectRepository.delete(id);
  }
};
