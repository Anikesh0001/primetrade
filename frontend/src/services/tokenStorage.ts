let accessToken: string | null = null;
let refreshToken: string | null = localStorage.getItem("refreshToken");

export const tokenStorage = {
  getAccessToken: () => accessToken,
  getRefreshToken: () => refreshToken,
  setTokens: (access: string, refresh: string) => {
    accessToken = access;
    refreshToken = refresh;
    localStorage.setItem("refreshToken", refresh);
  },
  clear: () => {
    accessToken = null;
    refreshToken = null;
    localStorage.removeItem("refreshToken");
  }
};
