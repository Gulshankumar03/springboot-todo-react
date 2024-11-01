import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import TodoApiService from "@/api/TodoApiService";
import AddTodoComponent from "./AddTodoComponent";
import { toast } from "@/hooks/use-toast";
import { Loader2, Pencil, Save, Trash2, X } from "lucide-react";

interface Todo {
  id: number;
  todo: string;
  createdAt: Date;
  completed: boolean;
}

export default function TodosComponent() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loadingStates, setLoadingStates] = useState<{
    [key: number]: boolean;
  }>({});
  const [editingId, setEditingId] = useState<number | null>(null);
  const [updatedTodoText, setUpdatedTodoText] = useState<string>("");

  useEffect(() => {
    refreshTodos();
  }, []);

  const refreshTodos = async () => {
    try {
      const response = await TodoApiService.getTodos();
      setTodos(response.data);
      setLoadingStates({});
      setEditingId(null);
    } catch (error) {
      console.error("Error fetching todos", error);
      toast({
        variant: "destructive",
        title: "Failed to fetch todos",
        description: "There was a problem with your request.",
      });
    }
  };

  const handleDeleteTodo = async (id: number) => {
    setLoadingStates((prev) => ({ ...prev, [id]: true }));

    try {
      await TodoApiService.deleteTodo(id);
      toast({ title: "Todo deleted successfully" });
      refreshTodos();
    } catch (error) {
      console.error("Error deleting todo:", error);
      toast({
        variant: "destructive",
        title: "Failed to delete todo",
        description: "There was a problem with your request.",
      });
      setLoadingStates((prev) => ({ ...prev, [id]: false }));
    }
  };

  const handleUpdateClick = (todo: Todo) => {
    setEditingId(todo.id);
    setUpdatedTodoText(todo.todo);
  };

  const handleUpdateSubmit = async (id: number) => {
    setLoadingStates((prev) => ({ ...prev, [id]: true }));

    try {
      await TodoApiService.updateTodo(id, { todo: updatedTodoText });
      toast({ title: "Todo updated successfully" });
      refreshTodos();
    } catch (error) {
      console.error("Error updating todo:", error);
      toast({
        variant: "destructive",
        title: "Failed to update todo",
        description: "There was a problem with your request.",
      });
      setLoadingStates((prev) => ({ ...prev, [id]: false }));
    }
  };

  const handleCancelUpdate = () => {
    setEditingId(null);
    setUpdatedTodoText("");
  };

  const handleToggleComplete = async (todo: Todo) => {
    setLoadingStates((prev) => ({ ...prev, [todo.id]: true }));

    try {
      await TodoApiService.updateTodo(todo.id, { completed: !todo.completed });
      refreshTodos();
    } catch (error) {
      console.error("Error updating todo completion:", error);
      toast({
        variant: "destructive",
        title: "Failed to update todo",
        description: "There was a problem with your request.",
      });
      setLoadingStates((prev) => ({ ...prev, [todo.id]: false }));
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-4xl font-light text-center mb-10 text-primary">
        Your Todos
      </h1>

      <div className="flex justify-center mb-8">
        <AddTodoComponent refreshTodos={refreshTodos} />
      </div>

      <ul className="mt-6 space-y-6">
        {todos.map((todo) => (
          <li
            key={todo.id}
            className="bg-white border border-gray-200 rounded-lg overflow-hidden transition-all duration-300 shadow-sm hover:shadow-lg"
          >
            <div className="flex items-center justify-between p-5">
              <div className="flex items-center space-x-4 flex-grow">
                <Checkbox
                  id={`todo-${todo.id}`}
                  checked={todo.completed}
                  onCheckedChange={() => handleToggleComplete(todo)}
                  disabled={loadingStates[todo.id]}
                  className="rounded-full border-2 border-primary/50 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
                {editingId === todo.id ? (
                  <Input
                    type="text"
                    value={updatedTodoText}
                    onChange={(e) => setUpdatedTodoText(e.target.value)}
                    className="flex-grow"
                  />
                ) : (
                  <label
                    htmlFor={`todo-${todo.id}`}
                    className={`text-base transition-all duration-300 ${
                      todo.completed
                        ? "line-through text-muted-foreground"
                        : "text-foreground"
                    }`}
                  >
                    {todo.todo}
                  </label>
                )}
              </div>
              <div className="flex items-center space-x-3">
                {editingId === todo.id ? (
                  <>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleUpdateSubmit(todo.id)}
                      disabled={loadingStates[todo.id]}
                      className="text-primary ml-3 hover:bg-green-200"
                    >
                      {loadingStates[todo.id] ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Save className="h-4 w-4 opacity-70" />
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handleCancelUpdate}
                      className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 "
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleUpdateClick(todo)}
                      className="text-muted-foreground hover:text-primary hover:bg-primary/10 "
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteTodo(todo.id)}
                      disabled={loadingStates[todo.id]}
                      className="text-muted-foreground hover:text-destructive  hover:bg-destructive/20"
                    >
                      {loadingStates[todo.id] ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </>
                )}
              </div>
            </div>
            <div className="px-5 py-1 bg-neutral-100 ">
              <span className="text-xs text-muted-foreground">
                Created: {new Date(todo.createdAt).toLocaleDateString()} at{" "}
                {new Date(todo.createdAt).toLocaleTimeString()}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
