import { useAuth } from "@/components/security/AuthContext";
import { apiClient } from "./ApiClient";

// Define the type for the Todo item based on your backend structure
interface Todo {
  id: number; // The unique identifier for the todo
  todo: string; // The todo text
  createdAt: string; // The creation time of the todo, formatted as a string
  isCompleted: boolean; // Indicates whether the todo is completed
}

const useTodoApiService = () => {
  const authContext = useAuth(); // Access the AuthContext
  const username = authContext?.username; // Safely get username, if exists

  if (!username) {
    throw new Error("Username is not available. Please log in.");
  }

  return {
    getTodos: async (): Promise<Todo[]> => {
      try {
        const response = await apiClient.get<Todo[]>(`/api/users/${username}/todos`);
        return response.data; // Should return an array of Todos
      } catch (error) {
        console.error("Error fetching todos:", error);
        throw error; // Re-throw the error for further handling
      }
    },

    addTodo: async (todoData: Omit<Todo, "id" | "createdAt">): Promise<Todo> => {
      try {
        const response = await apiClient.post<Todo>(
          `/api/users/${username}/todos`,
          todoData
        );
        return response.data; // Should return the created Todo
      } catch (error) {
        console.error("Error adding todo:", error);
        throw error; // Re-throw the error for further handling
      }
    },

    deleteTodo: async (id: number): Promise<void> => {
      try {
        await apiClient.delete(`/api/users/${username}/todos/${id}`);
      } catch (error) {
        console.error("Error deleting todo:", error);
        throw error; // Re-throw the error for further handling
      }
    },

    updateTodo: async (id: number, updatedData: Partial<Omit<Todo, "id" | "createdAt">>): Promise<Todo> => {
      try {
        const response = await apiClient.put<Todo>(
          `/api/users/${username}/todos/${id}`,
          updatedData
        );
        return response.data; // Should return the updated Todo
      } catch (error) {
        console.error("Error updating todo:", error);
        throw error; // Re-throw the error for further handling
      }
    },
  };
};

export default useTodoApiService;

// import { useAuth } from "@/components/security/AuthContext";
// import axios from "axios";

// // Define the type for the Todo item based on your backend structure
// interface Todo {
//   id: number; // The unique identifier for the todo
//   todo: string; // The todo text
//   createdAt: string; // The creation time of the todo, formatted as a string
//   isCompleted: boolean; // Indicates whether the todo is completed
// }

// const apiUrl = "http://localhost:8080";

// // Create an Axios instance
// const apiClient = axios.create({
//   baseURL: apiUrl,
//   withCredentials: true, // This allows cookies to be sent with requests
// });

// // Define a custom hook for Todo API service
// const useTodoApiService = () => {
//   const authContext = useAuth(); // Access the AuthContext
//   const username = authContext?.username; // Safely get username, if exists

//   if (!username) {
//     throw new Error("Username is not available. Please log in.");
//   }

//   return {
//     getTodos: async (): Promise<Todo[]> => {
//       try {
//         const response = await apiClient.get(`/api/users/${username}/todos`);
//         return response.data; // Should return an array of Todos
//       } catch (error) {
//         console.error("Error fetching todos:", error);
//         throw error; // Re-throw the error for further handling
//       }
//     },

//     addTodo: async (
//       todoData: Omit<Todo, "id" | "createdAt">
//     ): Promise<Todo> => {
//       try {
//         const response = await apiClient.post(
//           `/api/users/${username}/todos`,
//           todoData
//         );
//         return response.data; // Should return the created Todo
//       } catch (error) {
//         console.error("Error adding todo:", error);
//         throw error; // Re-throw the error for further handling
//       }
//     },

//     deleteTodo: async (id: number): Promise<void> => {
//       try {
//         await apiClient.delete(`/api/users/${username}/todos/${id}`);
//       } catch (error) {
//         console.error("Error deleting todo:", error);
//         throw error; // Re-throw the error for further handling
//       }
//     },

//     updateTodo: async (
//       id: number,
//       updatedData: Partial<Omit<Todo, "id" | "createdAt">>
//     ): Promise<Todo> => {
//       try {
//         const response = await apiClient.put(
//           `/api/users/${username}/todos/${id}`,
//           updatedData
//         );
//         return response.data; // Should return the updated Todo
//       } catch (error) {
//         console.error("Error updating todo:", error);
//         throw error; // Re-throw the error for further handling
//       }
//     },
//   };
// };

// export default useTodoApiService;
