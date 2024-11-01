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

const TodoApiService = {
  getTodos: () => 
    apiClient.get(`/api/users/${username}/todos`),
  
  addTodo: (todoData: object) =>
    apiClient.post(`/api/users/${username}/todos`, todoData),

  deleteTodo: (id: number) =>
    apiClient.delete(`/api/users/${username}/todos/${id}`),


  updateTodo: (id: number, updatedData: object) =>
    apiClient.put(`/api/users/${username}/todos/${id}`, updatedData),
};

export default TodoApiService;
