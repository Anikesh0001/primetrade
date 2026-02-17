export const getPagination = (page?: number, limit?: number) => {
  const currentPage = Math.max(1, page ?? 1);
  const perPage = Math.min(Math.max(limit ?? 10, 1), 100);
  const skip = (currentPage - 1) * perPage;
  return { currentPage, perPage, skip };
};
