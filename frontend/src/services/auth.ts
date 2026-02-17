import api from "./api";
import { tokenStorage } from "./tokenStorage";

export interface AuthResponse {
  user: { id: string; email: string; role: "USER" | "ADMIN" };
  accessToken: string;
  refreshToken: string;
}

export const authService = {
  register: async (email: string, password: string) => {
    const response = await api.post("/auth/register", { email, password });
    const data = response.data.data as AuthResponse;
    tokenStorage.setTokens(data.accessToken, data.refreshToken);
    return data.user;
  },
  login: async (email: string, password: string) => {
    const response = await api.post("/auth/login", { email, password });
    const data = response.data.data as AuthResponse;
    tokenStorage.setTokens(data.accessToken, data.refreshToken);
    return data.user;
  },
  refresh: async () => {
    const refreshToken = tokenStorage.getRefreshToken();
    if (!refreshToken) {
      throw new Error("Missing refresh token");
    }
    const response = await api.post("/auth/refresh", { refreshToken });
    const { accessToken, refreshToken: newRefresh } = response.data.data as {
      accessToken: string;
      refreshToken: string;
    };
    tokenStorage.setTokens(accessToken, newRefresh);
    return accessToken;
  },
  logout: async () => {
    await api.post("/auth/logout");
    tokenStorage.clear();
  }
};
