import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { Calendar, Loader2, Pencil, Save, Trash2, X } from "lucide-react";
import useTodoApiService from "@/api/TodoApiService";
import AddTodoComponent from "./AddTodoComponent";

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
  const [loadingStates, setLoadingStates] = useState<{ [key: number]: boolean }>({});
  const [editingId, setEditingId] = useState<number | null>(null);
  const [updatedTodoText, setUpdatedTodoText] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  const todoApiService = useTodoApiService();

  useEffect(() => {
    refreshTodos();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const refreshTodos = async () => {
    try {
      const response = await todoApiService.getTodos();
      const sortedTodos = response.sort((a: Todo, b: Todo) => {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      });
      setTodos(sortedTodos);
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
      refreshTodos();
    } catch (error) {
      console.error("Error deleting todo:", error);
      toast({
        variant: "destructive",
        title: "Failed to delete todo",
        description: "There was a problem with your request.",
      });
    } finally {
      setLoadingStates((prev) => ({ ...prev, [id]: false }));
    }
  };

  const handleUpdateClick = (todo: Todo) => {
    setEditingId(todo.id);
    setUpdatedTodoText(todo.todo);
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
      setLoadingStates((prev) => ({ ...prev, [todo.id]: false }));
    }
  };

  const groupedTodos = todos.reduce((acc: TodosByDate[], todo) => {
    const date = new Date(todo.createdAt).toISOString().split("T")[0];
    const existingGroup = acc.find((group) => group.date === date);
    if (existingGroup) {
      existingGroup.todos.unshift(todo);
    } else {
      acc.unshift({ date, todos: [todo] });
    }
    return acc;
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString("en-US", {
        weekday: "long",
        month: "short",
        day: "numeric",
      });
    }
  };

  return (
    <div className="min-h-[93vh] bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
            All Tasks
          </h1>
          <p className="text-gray-500 mt-2">Stay organized, stay productive</p>
        </div>

        <div className="flex justify-center mb-10">
          <AddTodoComponent refreshTodos={refreshTodos} />
        </div>

        {groupedTodos.map(({ date, todos }) => (
          <div key={date} className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-blue-500" />
              <h2 className="text-lg font-semibold text-gray-700">
                {formatDate(date)}
              </h2>
            </div>
            <div className="space-y-3">
              {todos.map((todo: Todo) => (
                <div
                  key={todo.id}
                  className={`bg-white rounded-lg shadow-sm`}
                >
                  <div className="flex items-center p-4">
                    <div className="flex w-10">
                      <Checkbox
                        id={`${todo.id}`}
                        checked={todo.isCompleted}
                        onCheckedChange={() => handleToggleComplete(todo)}
                        disabled={loadingStates[todo.id]}
                        className="w-5 h-5 rounded-full border-2 border-indigo-500 data-[state=checked]:bg-indigo-500 
                        data-[state=checked]:border-blue-500 transition-colors duration-100"
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
                            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
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
                    {/* <div className="text-right w-24 bg-red-500 text-sm text-muted-foreground"> */}
                    <div className="w-20 text-xs font-bold text-muted-foreground pl-4">
                      {new Date(todo.createdAt).toLocaleTimeString([], {
                        hour: "numeric",
                        minute: "numeric",
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
