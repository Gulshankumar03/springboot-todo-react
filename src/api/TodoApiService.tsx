import { useAuth } from "@/components/security/AuthContext";
import { apiClient } from "./ApiClient";
interface Todo {
  id: number;
  todo: string;
  createdAt: string;
  isCompleted: boolean;
}

const useTodoApiService = () => {
  const authContext = useAuth();
  const username = authContext?.username;

  if (!username) {
    throw new Error("Username is not available. Please log in.");
  }

  return {
    getTodos: async (): Promise<Todo[]> => {
      try {
        const response = await apiClient.get<Todo[]>(
          `/api/users/${username}/todos`
        );
        return response.data;
      } catch (error) {
        console.error("Error fetching todos:", error);
        throw error;
      }
    },

    addTodo: async (
      todoData: Omit<Todo, "id" | "createdAt">
    ): Promise<Todo> => {
      try {
        const response = await apiClient.post<Todo>(
          `/api/users/${username}/todos`,
          todoData
        );
        return response.data;
      } catch (error) {
        console.error("Error adding todo:", error);
        throw error;
      }
    },

    deleteTodo: async (id: number): Promise<void> => {
      try {
        await apiClient.delete(`/api/users/${username}/todos/${id}`);
      } catch (error) {
        console.error("Error deleting todo:", error);
        throw error;
      }
    },

    updateTodo: async (
      id: number,
      updatedData: Partial<Omit<Todo, "id" | "createdAt">>
    ): Promise<Todo> => {
      try {
        const response = await apiClient.put<Todo>(
          `/api/users/${username}/todos/${id}`,
          updatedData
        );
        return response.data;
      } catch (error) {
        console.error("Error updating todo:", error);
        throw error;
      }
    },
  };
};

export default useTodoApiService;
