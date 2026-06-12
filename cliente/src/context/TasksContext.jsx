import { createContext, useCallback, useContext, useState } from "react";
import {
  createTaskRequest,
  getTasksRequest,
  deleteTasksRequest,
  getTaskRequest,
  updateTasksRequest,
} from "../api/tasks";

const TasksContext = createContext();

export const useTasks = () => {
  const context = useContext(TasksContext);
  if (!context) {
    throw new Error("useTasks must be used within a TasksProvider");
  }
  return context;
};

export function TasksProvider({ children }) {
  const [tasks, setTasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(true);

  const getTasks = useCallback(async () => {
    setLoadingTasks(true);

    try {
      const res = await getTasksRequest();
      setTasks(res.data);
    } catch {
      // Keep the current task list if loading fails.
    } finally {
      setLoadingTasks(false);
    }
  }, []);

  const createTask = useCallback(async (task) => {
    const res = await createTaskRequest(task);
    setTasks((currentTasks) => [res.data, ...currentTasks]);
    return res.data;
  }, []);

  const deleteTask = useCallback(async (id) => {
    const res = await deleteTasksRequest(id);

    if (res.status === 204) {
      setTasks((currentTasks) =>
        currentTasks.filter((task) => task._id !== id),
      );
    }
  }, []);

  const getTask = useCallback(async (id) => {
    try {
      const res = await getTaskRequest(id);
      return res.data;
    } catch {
      return null;
    }
  }, []);

  const updateTask = useCallback(async (id, task) => {
    const res = await updateTasksRequest(id, task);

    setTasks((currentTasks) =>
      currentTasks.map((currentTask) =>
        currentTask._id === id ? res.data : currentTask,
      ),
    );

    return res.data;
  }, []);

  return (
    <TasksContext.Provider
      value={{
        tasks,
        createTask,
        getTasks,
        deleteTask,
        getTask,
        updateTask,
        loadingTasks,
      }}
    >
      {children}
    </TasksContext.Provider>
  );
}
