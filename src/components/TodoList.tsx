"use client";

import * as React from "react";
import axios from "axios";
import { Trash2, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
// import { useToast } from "@/components/ui/use-toast"

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

const api = axios.create({
  // baseURL: process.env.NEXT_PUBLIC_API_URL,
});

export default function TodoList() {
  const [todos, setTodos] = React.useState<Todo[]>([]);
  const [newTodo, setNewTodo] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(true);
  const [isAdding, setIsAdding] = React.useState(false);
  const { toast } = useToast();

  React.useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    setIsLoading(true);
    try {
      const response = await api.get<Todo[]>("/todos");
      setTodos(response.data);
    } catch (error) {
      console.error("Error fetching todos:", error);
      toast({
        title: "Error",
        description: "Failed to fetch todos. Please try again.",
        variant: "destructive",
      });
      setTodos([]); // Ensure todos is always an array
    } finally {
      setIsLoading(false);
    }
  };

  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodo.trim() !== "") {
      setIsAdding(true);
      try {
        const response = await api.post<Todo>("/todos", {
          text: newTodo,
          completed: false,
        });
        setTodos((prevTodos) => [...prevTodos, response.data]);
        setNewTodo("");
        toast({
          title: "Success",
          description: "Todo added successfully",
        });
      } catch (error) {
        console.error("Error adding todo:", error);
        toast({
          title: "Error",
          description: "Failed to add todo. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsAdding(false);
      }
    }
  };

  const toggleTodo = async (id: number) => {
    try {
      const todoToUpdate = todos.find((todo) => todo.id === id);
      if (!todoToUpdate) return;

      const response = await api.patch<Todo>(`/todos/${id}`, {
        completed: !todoToUpdate.completed,
      });

      setTodos((prevTodos) =>
        prevTodos.map((todo) => (todo.id === id ? response.data : todo))
      );
    } catch (error) {
      console.error("Error updating todo:", error);
      toast({
        title: "Error",
        description: "Failed to update todo. Please try again.",
        variant: "destructive",
      });
    }
  };

  const deleteTodo = async (id: number) => {
    try {
      await api.delete(`/todos/${id}`);
      setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
      toast({
        title: "Success",
        description: "Todo deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting todo:", error);
      toast({
        title: "Error",
        description: "Failed to delete todo. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Todo List</h1>
      <form onSubmit={addTodo} className="flex mb-4">
        <Input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add a new todo"
          className="flex-grow mr-2"
          disabled={isAdding}
        />
        <Button type="submit" disabled={isAdding}>
          {isAdding ? <Loader2 className="h-4 w-4 animate-spin" /> : "Add"}
        </Button>
      </form>
      {todos.length === 0 ? (
        <p className="text-center text-gray-500">
          No todos yet. Add one above!
        </p>
      ) : (
        <ul className="space-y-2">
          {todos.map((todo) => (
            <li
              key={todo.id}
              className="flex items-center bg-gray-100 p-2 rounded"
            >
              <Checkbox
                checked={todo.completed}
                onCheckedChange={() => toggleTodo(todo.id)}
                className="mr-2"
              />
              <span
                className={`flex-grow ${
                  todo.completed
                    ? "line-through text-gray-500"
                    : "text-gray-800"
                }`}
              >
                {todo.text}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => deleteTodo(todo.id)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Delete todo</span>
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
