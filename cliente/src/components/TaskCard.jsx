import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CalendarDays, ChevronDown } from "lucide-react";
import { formatDate } from "../utils/formatDate";
import { useTaskStatusUpdater } from "../hooks/useTaskStatusUpdater";

import {
  priorityColors,
  statusColors,
  statusOptions,
} from "../utils/taskOptions";

function TaskCard({ task, onDeleteClick, variant = "grid" }) {
  const isKanban = variant === "kanban";
  const navigate = useNavigate();

  const updateTaskStatus = useTaskStatusUpdater();
  const [showStatusMenu, setShowStatusMenu] = useState(false);

  const handleStatusChange = async (newStatus) => {
    await updateTaskStatus(task, newStatus);
    setShowStatusMenu(false);
  };

  return (
    <div
      onClick={() => navigate(`/tasks/${task._id}`)}
      className={`group relative flex w-full cursor-pointer flex-col rounded-md border border-zinc-700/80 bg-zinc-800/85 shadow-sm transition hover:-translate-y-0.5 hover:border-zinc-600 hover:bg-zinc-800 hover:shadow-[0_18px_45px_rgba(0,0,0,0.25)] ${
        isKanban
          ? "min-h-[180px] max-w-none p-4"
          : "min-h-[220px] max-w-md p-5 pb-5 sm:p-8 lg:p-10"
      }`}
    >
      <header className="flex justify-between">
        <h1
          className={`break-words pr-16 font-bold line-clamp-2 sm:pr-20 ${
            isKanban ? "text-lg" : "text-xl sm:text-2xl"
          }`}
        >
          {""}
          {task.title}
        </h1>
        <span
          className={`absolute right-3 top-3 rounded-md border px-2 py-1 text-xs font-semibold uppercase ${
            priorityColors[task.priority] ||
            "border-zinc-600 bg-zinc-700/40 text-zinc-300"
          }`}
        >
          {task.priority}
        </span>
      </header>
      <p className="text-slate-300 break-words line-clamp-2 mt-2">
        {task.description}
      </p>

      <div className="mt-auto pt-5">
        <p className="mb-4 flex items-center gap-2 text-sm text-white">
          <CalendarDays size={16} className="text-purple-300" />
          <span className="text-zinc-400">Due:</span>
          <span>{formatDate(task.dueDate)}</span>
        </p>

        <div className="flex flex-wrap items-end justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            <button
              className="rounded-md bg-red-600 px-3 py-2 text-white hover:bg-red-700"
              onClick={(e) => {
                e.stopPropagation();
                onDeleteClick(task);
              }}
            >
              Delete
            </button>
            <Link
              className="rounded-md bg-blue-600 px-3 py-2 text-white hover:bg-blue-700"
              to={`/tasks/${task._id}/edit`}
              onClick={(e) => e.stopPropagation()}
            >
              Edit
            </Link>
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowStatusMenu(!showStatusMenu);
              }}
              className={`${
                statusColors[task.status] || "bg-zinc-600"
              } flex w-fit min-w-[120px] items-center justify-center gap-2 rounded-md px-3 py-2 text-white`}
            >
              {task.status}
              <ChevronDown size={16} />
            </button>

            {showStatusMenu && (
              <div
                className="absolute bottom-full right-0 z-20 mb-2 w-40 rounded-md border border-zinc-700 bg-zinc-800 p-1 shadow-xl"
                onClick={(e) => e.stopPropagation()}
              >
                {statusOptions.map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => handleStatusChange(status)}
                    className={`block w-full rounded-md px-3 py-2 text-left text-sm hover:bg-zinc-700 ${
                      status === task.status ? "text-purple-300" : "text-white"
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TaskCard;

