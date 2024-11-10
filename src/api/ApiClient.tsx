import axios from "axios";

const apiUrl = "http://localhost:8080";

export const apiClient = axios.create({
  baseURL: apiUrl,
});
