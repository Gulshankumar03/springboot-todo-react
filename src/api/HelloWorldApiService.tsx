import axios from "axios";

const apiUrl = "http://localhost:8080";
const username = "gulshan";
const password = "gillu";

  const apiClient = axios.create({
    baseURL: apiUrl,
    auth: {
      username: username,
      password: password,
    },
  });

  const HelloWorldApiService = () =>
    apiClient.get(`/api/users/gulshan/todos`);

export default HelloWorldApiService;
