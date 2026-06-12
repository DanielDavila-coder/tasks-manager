import { useForm } from "react-hook-form";
import { useTasks } from "../context/TasksContext";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useNotification } from "../context/NotificationContext";
import {
  areaLabels,
  areaOptions,
  priorityOptions,
  statusOptions,
} from "../utils/taskOptions";
import PageGlow from "../components/PageGlow";
import TaskNotFound from "../components/TaskNotFound";

import dayjs from "dayjs";

const autoResize = (element) => {
  if (!element) return;
  element.style.height = "auto";
  element.style.height = `${element.scrollHeight}px`;
};

function TasksFormPage() {
  const { register, handleSubmit, setValue } = useForm({
    defaultValues: {
      area: "personal",
    },
  });
  const { createTask, getTask, updateTask } = useTasks();
  const { showNotification } = useNotification();

  const navigate = useNavigate();
  const params = useParams();
  const isEditing = Boolean(params.id);

  const titleRef = useRef(null);
  const descriptionRef = useRef(null);
  const titleRegister = register("title");
  const descriptionRegister = register("description");

  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function loadTask() {
      if (params.id) {
        const task = await getTask(params.id);
        if (!task) {
          setNotFound(true);
          return;
        }
        setValue("title", task.title);
        setValue("description", task.description);
        setValue("status", task.status);
        setValue("priority", task.priority);
        setValue("area", task.area || "personal");

        setTimeout(() => {
          autoResize(titleRef.current);
          autoResize(descriptionRef.current);
        }, 0);

        if (task.dueDate) {
          setValue("dueDate", dayjs(task.dueDate).format("YYYY-MM-DD"));
        }
      }
    }
    loadTask();
  }, [getTask, params.id, setValue]);

  const onSubmit = handleSubmit(async (data) => {
    const dataValid = {
      title: data.title.trim(),
      description: data.description.trim(),
      status: data.status,
      priority: data.priority,
      area: data.area,
      dueDate: null,
    };

    if (data.dueDate) {
      dataValid.dueDate = dayjs(data.dueDate).toISOString();
    }
    try {
      if (params.id) {
        await updateTask(params.id, dataValid);
      } else {
        await createTask(dataValid);
      }
      showNotification(
        isEditing ? "Task updated successfully" : "Task created successfully",
        "success",
      );
      navigate("/tasks");
    } catch {
      showNotification(
        isEditing
          ? "Could not update the task. Please try again."
          : "Could not create the task. Please try again.",
        "error",
      );
    }
  });

  if (notFound) {
    return (
      <TaskNotFound
        title="Task not found"
        message="This task cannot be edited because it does not exist or you no longer have access to it."
      />
    );
  }

  return (
    <div className="relative isolate flex min-h-[calc(100vh-120px)] items-start justify-center px-4 py-8">
      <PageGlow />

      <div className="w-full max-w-lg rounded-md bg-zinc-800 p-5 sm:p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">
            {isEditing ? "Edit task" : "Create task"}
          </h1>
          <p className="mt-1 text-sm text-zinc-400">
            {isEditing
              ? "Update your task details, priority, status, and due date."
              : "Add a new task with all the details you need to stay organized."}
          </p>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="text-sm text-zinc-300">
              Title
            </label>
            <textarea
              id="title"
              rows="1"
              placeholder="title"
              {...titleRegister}
              ref={(element) => {
                titleRegister.ref(element);
                titleRef.current = element;
              }}
              onInput={(e) => autoResize(e.target)}
              className="mt-1 min-h-[40px] w-full resize-none overflow-hidden bg-zinc-700 text-white px-4 py-2 rounded-md"
              autoFocus
            ></textarea>
          </div>
          <div>
            <label htmlFor="description" className="text-sm text-zinc-300">
              Description
            </label>
            <textarea
              id="description"
              rows="2"
              placeholder="description"
              {...descriptionRegister}
              ref={(element) => {
                descriptionRegister.ref(element);
                descriptionRef.current = element;
              }}
              onInput={(e) => autoResize(e.target)}
              className="mt-1 min-h-[80px] w-full resize-none overflow-hidden bg-zinc-700 text-white px-4 py-2 rounded-md"
            ></textarea>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="status" className="text-sm text-zinc-300">
                Status
              </label>
              <select
                id="status"
                {...register("status")}
                className="mt-1 w-full bg-zinc-700 text-white px-4 py-2 rounded-md"
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="priority" className="text-sm text-zinc-300">
                Priority
              </label>
              <select
                id="priority"
                {...register("priority")}
                className="mt-1 w-full bg-zinc-700 text-white px-4 py-2 rounded-md"
              >
                {priorityOptions.map((priority) => (
                  <option key={priority} value={priority}>
                    {priority}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="area" className="text-sm text-zinc-300">
                Area
              </label>
              <select
                id="area"
                {...register("area")}
                className="mt-1 w-full bg-zinc-700 text-white px-4 py-2 rounded-md"
              >
                {areaOptions.map((area) => (
                  <option key={area} value={area}>
                    {areaLabels[area]}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label htmlFor="dueDate" className="text-sm text-zinc-300">
              Due date
            </label>
            <input
              id="dueDate"
              type="date"
              {...register("dueDate")}
              className="mt-1 w-full bg-zinc-700 text-white px-4 py-2 rounded-md"
            ></input>
          </div>
          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => navigate("/tasks")}
              className="rounded-md bg-zinc-700 px-4 py-2 hover:bg-zinc-600"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-md bg-indigo-600 px-4 py-2 hover:bg-indigo-700"
            >
              {isEditing ? "Save changes" : "Create task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TasksFormPage;
