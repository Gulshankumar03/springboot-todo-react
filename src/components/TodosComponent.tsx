import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import AddTodoComponent from "./AddTodoComponent";
import { toast } from "@/hooks/use-toast";
import { Loader2, Pencil, Save, Trash2, X } from "lucide-react";
import useTodoApiService from "@/api/TodoApiService";
interface Todo {
  id: number;
  todo: string;
  createdAt: string;
  isCompleted: boolean;
}

interface TodosByDate {
  date: string;
  todos: Todo[];
}

export default function TodosComponent() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loadingStates, setLoadingStates] = useState<{
    [key: number]: boolean;
  }>({});
  const [editingId, setEditingId] = useState<number | null>(null);
  const [updatedTodoText, setUpdatedTodoText] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  const todoApiService = useTodoApiService();

  useEffect(() => {
    refreshTodos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  const refreshTodos = async () => {
    try {
      const response = await todoApiService.getTodos();
      setTodos(response);
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
      await todoApiService.deleteTodo(id);
      toast({ title: "Todo deleted successfully" });
      refreshTodos(); // Refresh todos after deletion
    } catch (error) {
      console.error("Error deleting todo:", error);
      toast({
        variant: "destructive",
        title: "Failed to delete todo",
        description: "There was a problem with your request.",
      });
    } finally {
      setLoadingStates((prev) => ({ ...prev, [id]: false })); // Reset loading state
    }
  };

  const handleUpdateClick = (todo: Todo) => {
    setEditingId(todo.id);
    setUpdatedTodoText(todo.todo);
    // Focus and select the text in the input field
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    }, 0);
  };

  const handleUpdateSubmit = async (id: number) => {
    setLoadingStates((prev) => ({ ...prev, [id]: true }));
    try {
      await todoApiService.updateTodo(id, { todo: updatedTodoText });
      toast({ title: "Todo updated successfully" });
      refreshTodos();
    } catch (error) {
      console.error("Error updating todo:", error);
      toast({
        variant: "destructive",
        title: "Failed to update todo",
        description: "There was a problem with your request.",
      });
    } finally {
      setLoadingStates((prev) => ({ ...prev, [id]: false })); // Reset loading state
    }
  };

  const handleCancelUpdate = () => {
    setEditingId(null);
    setUpdatedTodoText("");
  };

  const handleToggleComplete = async (todo: Todo) => {
    setLoadingStates((prev) => ({ ...prev, [todo.id]: true }));
    try {
      await todoApiService.updateTodo(todo.id, {
        isCompleted: !todo.isCompleted,
      });
      refreshTodos();
    } catch (error) {
      console.error("Error updating todo completion:", error);
      toast({
        variant: "destructive",
        title: "Failed to update todo",
        description: "There was a problem with your request.",
      });
    } finally {
      setLoadingStates((prev) => ({ ...prev, [todo.id]: false })); // Reset loading state
    }
  };

  // Group todos by their creation date
  const groupedTodos = todos.reduce((acc: TodosByDate[], todo) => {
    const date = new Date(todo.createdAt).toISOString().split("T")[0]; // YYYY-MM-DD
    const existingGroup = acc.find((group) => group.date === date);
    if (existingGroup) {
      existingGroup.todos.push(todo);
    } else {
      acc.push({ date, todos: [todo] });
    }
    return acc;
  }, []);

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <h1 className="text-4xl font-light text-center mb-10 text-primary">
        Your Todos
      </h1>

      <div className="flex justify-center mb-8">
        <AddTodoComponent refreshTodos={refreshTodos} />
      </div>

      {groupedTodos.map(({ date, todos }) => (
        <div key={date} className="mb-6">
          <h2 className="text-xl font-semibold mb-2">
            {new Date(date).toLocaleDateString()}
          </h2>
          <div className=" rounded-lg shadow-sm overflow-hidden">
            {todos.map((todo) => (
              <div
                key={todo.id}
                className="flex items-center justify-between p-5 border-b  hover:bg-yellow-50 hover:shadow-sm border-gray-200"
              >
                <div className="w-8 flex">
                  <Checkbox
                    id={`${todo.id}`}
                    checked={todo.isCompleted}
                    onCheckedChange={() => handleToggleComplete(todo)}
                    disabled={loadingStates[todo.id]}
                    className="rounded-full border-2 border-primary/50 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                </div>

                <div className="w-3/5 flex items-center space-x-4 mr-5 flex-grow">
                  {editingId === todo.id ? (
                    <Input
                      type="text"
                      ref={inputRef}
                      value={updatedTodoText}
                      onChange={(e) => setUpdatedTodoText(e.target.value)}
                      className="w-full"
                    />
                  ) : (
                    <label
                      htmlFor={`todo-${todo.id}`}
                      className={`text-base transition-all duration-300 ${
                        todo.isCompleted
                          ? "line-through text-muted-foreground"
                          : "text-foreground"
                      }`}
                    >
                      {todo.todo}
                    </label>
                  )}
                </div>
                <div className="w-24 flex items-center space-x-3">
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
                        className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
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
                        className="text-muted-foreground hover:text-primary hover:bg-primary/10"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteTodo(todo.id)}
                        disabled={loadingStates[todo.id]}
                        className="text-muted-foreground hover:text-destructive hover:bg-destructive/20"
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
                <div className="w-20 text-xs text-muted-foreground pl-4">
                  {new Date(todo.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
