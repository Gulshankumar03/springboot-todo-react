import { apiClient } from "./ApiClient";

export const basicAuthApi = (token: string) =>
  apiClient.get("/api/auth/basicauth", {
    headers: {
      Authorization: token,
    },
  });

export const jwtAuthApi = (username: string, password: string) =>
  apiClient.post("/authenticate", { username, password });
