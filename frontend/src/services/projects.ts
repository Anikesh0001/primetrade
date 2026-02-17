import api from "./api";

export type ProjectStatus = "ACTIVE" | "COMPLETED" | "ARCHIVED";

export interface Project {
  id: string;
  title: string;
  description: string;
  status: ProjectStatus;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export const projectService = {
  list: async (params?: { status?: ProjectStatus; search?: string }) => {
    const response = await api.get("/projects", { params });
    return response.data.data as { items: Project[]; meta: { total: number; page: number; limit: number; pages: number } };
  },
  create: async (payload: { title: string; description: string; status?: ProjectStatus }) => {
    const response = await api.post("/projects", payload);
    return response.data.data as Project;
  },
  update: async (id: string, payload: { title?: string; description?: string; status?: ProjectStatus }) => {
    const response = await api.put(`/projects/${id}`, payload);
    return response.data.data as Project;
  },
  remove: async (id: string) => {
    const response = await api.delete(`/projects/${id}`);
    return response.data.data as Project;
  }
};
