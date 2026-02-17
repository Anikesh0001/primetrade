import { prisma } from "../config/prisma";
import { ProjectStatus } from "@prisma/client";

interface ProjectFilters {
  ownerId?: string;
  status?: ProjectStatus;
  search?: string;
}

export const projectRepository = {
  create: (data: { title: string; description: string; status?: ProjectStatus; ownerId: string }) =>
    prisma.project.create({ data }),
  findById: (id: string) => prisma.project.findUnique({ where: { id } }),
  update: (id: string, data: { title?: string; description?: string; status?: ProjectStatus }) =>
    prisma.project.update({ where: { id }, data }),
  delete: (id: string) => prisma.project.delete({ where: { id } }),
  list: (filters: ProjectFilters, skip: number, take: number) =>
    prisma.project.findMany({
      where: {
        ...(filters.ownerId ? { ownerId: filters.ownerId } : {}),
        ...(filters.status ? { status: filters.status } : {}),
        ...(filters.search
          ? {
              OR: [
                { title: { contains: filters.search, mode: "insensitive" } },
                { description: { contains: filters.search, mode: "insensitive" } }
              ]
            }
          : {})
      },
      skip,
      take,
      orderBy: { createdAt: "desc" }
    }),
  count: (filters: ProjectFilters) =>
    prisma.project.count({
      where: {
        ...(filters.ownerId ? { ownerId: filters.ownerId } : {}),
        ...(filters.status ? { status: filters.status } : {}),
        ...(filters.search
          ? {
              OR: [
                { title: { contains: filters.search, mode: "insensitive" } },
                { description: { contains: filters.search, mode: "insensitive" } }
              ]
            }
          : {})
      }
    })
};
