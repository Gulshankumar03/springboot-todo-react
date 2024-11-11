import { apiClient } from "./ApiClient";

export const basicAuthApi = (token:string) =>
  apiClient.get("/api/auth/basicauth", {
    headers: {
      Authorization: token,
    },
  });
