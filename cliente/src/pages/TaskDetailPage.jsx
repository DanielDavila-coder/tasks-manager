import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useTasks } from "../context/TasksContext";
import { formatDate } from "../utils/formatDate";
import { priorityLabels, statusColors, areaLabels } from "../utils/taskOptions";
import LoadingScreen from "../components/LoadingScreen";
import PageGlow from "../components/PageGlow";
import TaskNotFound from "../components/TaskNotFound";

function TaskDetailPage() {
  const { id } = useParams();
  const { getTask } = useTasks();
  const [task, setTask] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function loadTask() {
      const task = await getTask(id);

      if (!task) {
        setNotFound(true);
        return;
      }
      setTask(task);
    }
    loadTask();
  }, [getTask, id]);

  if (notFound) {
    return <TaskNotFound />;
  }

  if (!task) {
    return <LoadingScreen text="Loading task..." />;
  }

  return (
    <div className="flex min-h-[calc(100vh-120px)] items-start justify-center px-4 py-8">
      <PageGlow />

      <article className="relative w-full max-w-lg rounded-md bg-zinc-800 p-5 sm:p-8">
        <span className="absolute right-5 top-4 text-sm uppercase tracking-wide text-zinc-300 sm:right-6 sm:text-lg">
          {priorityLabels[task.priority] || task.priority}
        </span>

        <header className="mb-6 mt-6 pr-16 sm:pr-20">
          <h1 className="break-words text-2xl font-bold leading-tight sm:text-3xl">
            {task.title}
          </h1>
        </header>

        <section className="mb-6">
          <h2 className="text-sm text-zinc-400 mb-2">Description</h2>
          <div className="bg-zinc-900/50 rounded-md p-4 min-h-[100px] ">
            <p className="text-zinc-200 leading-relaxed whitespace-pre-wrap break-words">
              {task.description}
            </p>
          </div>
        </section>

        <section className="bg-zinc-900/10 rounded-md p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-zinc-400">Created</p>
            <p className="text-white">
              {formatDate(task.createdAt, "Not available")}
            </p>
          </div>

          <div>
            <p className="text-xs text-zinc-400">Due date</p>
            <p className="text-white">{formatDate(task.dueDate)}</p>
          </div>

          <div>
            <p className="text-xs text-zinc-400">Area</p>
            <p className="text-white">{areaLabels[task.area] || "Personal"}</p>
          </div>

          <div>
            <p className="text-xs text-zinc-400">Status</p>
            <span
              className={`${
                statusColors[task.status] || "bg-zinc-600"
              } inline-block text-white px-2 py-2 rounded-md mt-1`}
            >
              {task.status}
            </span>
          </div>
        </section>

        <footer className="mt-4 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end sm:gap-4">
          <Link
            to="/tasks"
            className="rounded-md bg-zinc-600 px-4 py-2 text-center hover:bg-zinc-500"
          >
            Back
          </Link>

          <Link
            to={`/tasks/${task._id}/edit`}
            className="rounded-md bg-blue-600 px-4 py-2 text-center text-white hover:bg-blue-700"
          >
            Edit
          </Link>
        </footer>
      </article>
    </div>
  );
}

export default TaskDetailPage;
