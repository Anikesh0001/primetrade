import { userRepository } from "../repositories/userRepository";
import { getPagination } from "../utils/pagination";

/**
 * User domain services.
 */
export const userService = {
  list: async (page?: number, limit?: number) => {
    const { currentPage, perPage, skip } = getPagination(page, limit);
    const users = await userRepository.list(skip, perPage);
    return {
      items: users.map((user) => ({ id: user.id, email: user.email, role: user.role, createdAt: user.createdAt })),
      meta: { page: currentPage, limit: perPage }
    };
  }
};
