import React, { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";
import TodoApiService from "@/api/TodoApiService";

interface Todo {
  todo: string;
  completed: boolean;
}

interface AddTodoComponentProps {
  refreshTodos: () => void;
}

const AddTodoComponent: React.FC<AddTodoComponentProps> = ({
  refreshTodos,
}) => {
  const [todoText, setTodoText] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();

  const handleAddTodo = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedTodoText = todoText.trim();
    if (!trimmedTodoText) {
      toast({
        variant: "destructive",
        title: "Invalid Input",
        description: "Please enter a todo item.",
      });
      return;
    }

    //In case of multiple submissions
    if (isLoading) return;

    setIsLoading(true);

    const todoData: Todo = {
      todo: trimmedTodoText,
      completed: false,
    };

    try {
      await TodoApiService.addTodo(todoData);
      toast({
        description: "Todo added successfully!",
      });

      setTodoText("");
      refreshTodos();
    } catch (error) {
      console.error("Error adding todo:", error);
      toast({
        variant: "destructive",
        description: "Failed to add todo!",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form 
      onSubmit={handleAddTodo} 
      className="flex gap-2 mb-8 w-full max-w-md"
    >
      <Input
        className="border border-gray-400 flex-grow"
        autoFocus
        type="text"
        placeholder="Add your task"
        value={todoText}
        onChange={(e) => setTodoText(e.target.value)}
        disabled={isLoading}
      />
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Adding..." : "Add"}
      </Button>
    </form>
  );
};

export default AddTodoComponent;
