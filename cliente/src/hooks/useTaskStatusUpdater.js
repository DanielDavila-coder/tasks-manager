import { useCallback } from "react";
import { useTasks } from "../context/TasksContext";
import { useNotification } from "../context/NotificationContext";

export function useTaskStatusUpdater() {
  const { updateTask } = useTasks();
  const { showNotification } = useNotification();

  return useCallback(
    async (task, newStatus) => {
      if (!task || task.status === newStatus) {
        return { ok: true, changed: false };
      }

      try {
        await updateTask(task._id, { status: newStatus });
        showNotification("Task status updated", "success");

        return { ok: true, changed: true };
      } catch {
        showNotification(
          "Could not update task status. Please try again",
          "error",
        );
        return { ok: false, changed: false };
      }
    },
    [updateTask, showNotification],
  );
}
