import axios from "axios";

// const apiUrl = "http://localhost:5000";
const apiUrl = "http://task-mate-env-1.eba-66iepabq.ap-south-1.elasticbeanstalk.com";

export const apiClient = axios.create({
  baseURL: apiUrl,
});
