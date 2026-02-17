import { prisma } from "../config/prisma";
import { Role, User } from "@prisma/client";

export const userRepository = {
  create: (data: { email: string; passwordHash: string; role?: Role }) =>
    prisma.user.create({ data }),
  findByEmail: (email: string) => prisma.user.findUnique({ where: { email } }),
  findById: (id: string) => prisma.user.findUnique({ where: { id } }),
  updateRefreshToken: (id: string, refreshTokenHash: string | null) =>
    prisma.user.update({ where: { id }, data: { refreshTokenHash } }),
  list: (skip: number, take: number) =>
    prisma.user.findMany({ skip, take, orderBy: { createdAt: "desc" } })
};
