import { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import { Link } from "react-router-dom";
import {
  CalendarDays,
  ClipboardList,
  Columns3,
  LayoutGrid,
  Flag,
  ListPlus,
  Search,
  SearchX,
  SlidersHorizontal,
} from "lucide-react";
import { useTasks } from "../context/TasksContext";
import TaskCard from "../components/TaskCard";
import { useNotification } from "../context/NotificationContext";
import ConfirmDelete from "../components/ConfirmDelete";
import LoadingScreen from "../components/LoadingScreen";
import PageGlow from "../components/PageGlow";
import {
  areaLabels,
  areaOptions,
  getTaskArea,
  priorityOptions,
  priorityWeight,
  statusOptions,
} from "../utils/taskOptions";
import KanbanBoard from "../components/KanbanBoard";

function TasksPage() {
  const { getTasks, tasks, deleteTask, loadingTasks } = useTasks();
  const { showNotification } = useNotification();

  const [taskToDelete, setTaskToDelete] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [dueDateFilter, setDueDateFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState("grid");
  const [areaFilter, setAreaFilter] = useState("all");

  const areaTabs = [
    { value: "all", label: "All tasks" },
    ...areaOptions.map((area) => ({
      value: area,
      label: areaLabels[area],
    })),
  ];

  const selectedAreaLabel =
    areaFilter === "all" ? "All tasks" : areaLabels[areaFilter];

  const handleDeleteTask = async () => {
    if (!taskToDelete) return;

    try {
      await deleteTask(taskToDelete._id);
      showNotification("Task deleted successfully", "success");
      setTaskToDelete(null);
    } catch {
      showNotification("Could not delete task. Please try again", "error");
    }
  };

  useEffect(() => {
    getTasks();
  }, [getTasks]);

  const areaTasks = useMemo(() => {
    if (areaFilter === "all") return tasks;

    return tasks.filter((task) => getTaskArea(task) === areaFilter);
  }, [tasks, areaFilter]);

  const filteredTasks = useMemo(() => {
    let result = [...areaTasks];

    const query = search.trim().toLowerCase();

    if (query) {
      result = result.filter(
        (task) =>
          task.title?.toLowerCase().includes(query) ||
          task.description?.toLowerCase().includes(query),
      );
    }

    if (statusFilter !== "all") {
      result = result.filter((task) => task.status === statusFilter);
    }

    if (priorityFilter !== "all") {
      result = result.filter((task) => task.priority === priorityFilter);
    }

    if (dueDateFilter !== "all") {
      const today = dayjs().startOf("day");
      const nextSevenDays = dayjs().add(7, "day").endOf("day");

      result = result.filter((task) => {
        if (dueDateFilter === "no-due-date") return !task.dueDate;
        if (!task.dueDate) return false;

        const dueDate = dayjs(task.dueDate);

        if (dueDateFilter === "overdue") {
          return task.status !== "completed" && dueDate.isBefore(today);
        }

        if (dueDateFilter === "today") {
          return dueDate.isSame(today, "day");
        }

        if (dueDateFilter === "this-week") {
          return (
            (dueDate.isSame(today, "day") || dueDate.isAfter(today)) &&
            dueDate.isBefore(nextSevenDays)
          );
        }

        return true;
      });
    }

    result.sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }

      if (sortBy === "oldest") {
        return new Date(a.createdAt) - new Date(b.createdAt);
      }

      if (sortBy === "due-soon") {
        const aDate = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
        const bDate = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
        return aDate - bDate;
      }

      if (sortBy === "due-latest") {
        const aDate = a.dueDate ? new Date(a.dueDate).getTime() : -Infinity;
        const bDate = b.dueDate ? new Date(b.dueDate).getTime() : -Infinity;
        return bDate - aDate;
      }

      if (sortBy === "priority") {
        return (
          (priorityWeight[b.priority] || 0) - (priorityWeight[a.priority] || 0)
        );
      }

      return 0;
    });

    return result;
  }, [areaTasks, search, statusFilter, priorityFilter, dueDateFilter, sortBy]);

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setPriorityFilter("all");
    setDueDateFilter("all");
    setSortBy("newest");
  };

  const hasActiveFilters =
    search ||
    statusFilter !== "all" ||
    priorityFilter !== "all" ||
    dueDateFilter !== "all" ||
    sortBy !== "newest";

  if (loadingTasks) {
    return <LoadingScreen text="Loading tasks..." />;
  }

  if (tasks.length === 0) {
    return (
      <div className="relative isolate flex min-h-[calc(100vh-140px)] items-start justify-center px-4 pb-10 pt-6">
        <PageGlow />

        <section className="relative w-full max-w-lg overflow-hidden rounded-md border border-zinc-700 bg-zinc-800/80 p-7 text-center shadow-[0_24px_90px_rgba(147,51,234,0.12)]">
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(147,51,234,0.12),transparent_42%)]" />

          <div className="relative">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-md bg-purple-600/20 text-purple-300">
              <ClipboardList size={34} strokeWidth={1.8} />
            </div>

            <h1 className="mb-3 text-2xl font-bold sm:text-3xl">
              Your task list is empty
            </h1>

            <p className="mx-auto mb-4 max-w-md text-zinc-300">
              Create your first task with details, priority, status, and a due
              date to start organizing your work.
            </p>

            <Link
              to="/add-task"
              className="inline-flex items-center gap-2 rounded-md bg-indigo-500 px-5 py-2.5 font-semibold text-white hover:bg-indigo-600"
            >
              <ListPlus size={18} />
              Add task
            </Link>

            <div className="mt-6 grid gap-3 border-t border-zinc-700 pt-5 text-left text-sm sm:grid-cols-3">
              <div className="flex gap-3">
                <CalendarDays
                  className="mt-0.5 shrink-0 text-purple-300"
                  size={18}
                />
                <div>
                  <p className="font-semibold">Add due dates</p>
                  <p className="mt-1 text-zinc-400">Keep deadlines visible.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <Flag className="mt-0.5 shrink-0 text-yellow-300" size={18} />
                <div>
                  <p className="font-semibold">Set priorities</p>
                  <p className="mt-1 text-zinc-400">Focus on what matters.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <SlidersHorizontal
                  className="mt-0.5 shrink-0 text-green-400"
                  size={18}
                />
                <div>
                  <p className="font-semibold">Use filters</p>
                  <p className="mt-1 text-zinc-400">Find tasks faster.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="relative isolate space-y-5">
      <PageGlow />

      <div className="rounded-md border border-zinc-700 bg-zinc-800/80 p-2 shadow-sm">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {areaTabs.map((area) => (
            <button
              key={area.value}
              type="button"
              onClick={() => setAreaFilter(area.value)}
              className={`rounded-md px-4 py-2 text-sm font-semibold transition ${
                areaFilter === area.value
                  ? "bg-indigo-600 text-white"
                  : "bg-zinc-900/40 text-zinc-300 hover:bg-zinc-700 hover:text-white"
              }`}
            >
              {area.label}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-md border border-zinc-700 bg-zinc-800/80 p-4 py-3 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center justify-center gap-2 rounded-md bg-zinc-700 px-4 py-2 hover:bg-zinc-600"
            >
              <SlidersHorizontal size={18} />
              {showFilters ? "Hide filters" : "Filters"}
            </button>
            <p className="text-center text-sm text-zinc-400 sm:text-left">
              {filteredTasks.length} of {areaTasks.length} tasks
            </p>
          </div>

          <div className="flex w-full flex-col gap-3 lg:w-auto lg:flex-row lg:items-center">
            <div className="relative w-full lg:w-96">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
              />
              <input
                type="text"
                placeholder="Search tasks..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-md bg-zinc-700 py-2 pl-10 pr-3 text-sm text-zinc-200 placeholder:text-zinc-400 focus:bg-zinc-800 focus:outline-none"
              />
            </div>

            <div className="grid w-full grid-cols-2 rounded-md bg-zinc-900/50 p-2 sm:inline-flex sm:w-auto">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm ${
                  viewMode === "grid"
                    ? "bg-zinc-700 text-white"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                <LayoutGrid size={16} />
                Grid
              </button>

              <button
                type="button"
                onClick={() => setViewMode("kanban")}
                className={`inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm ${
                  viewMode === "kanban"
                    ? "bg-zinc-700 text-white"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                <Columns3 size={16} />
                Status
              </button>
            </div>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex items-center justify-center gap-2 rounded-md bg-zinc-600 px-4 py-2 hover:bg-zinc-500"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {showFilters && (
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div>
              <label className="text-xs text-zinc-400">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="mt-1 w-full bg-zinc-700 text-white px-3 py-2 rounded-md"
              >
                <option value="all">All</option>

                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs text-zinc-400">Priority</label>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="mt-1 w-full bg-zinc-700 text-white px-3 py-2 rounded-md"
              >
                <option value="all">All</option>

                {priorityOptions.map((priority) => (
                  <option key={priority} value={priority}>
                    {priority}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs text-zinc-400">Due date</label>
              <select
                value={dueDateFilter}
                onChange={(e) => setDueDateFilter(e.target.value)}
                className="mt-1 w-full bg-zinc-700 text-white px-3 py-2 rounded-md"
              >
                <option value="all">All</option>
                <option value="overdue">Overdue</option>
                <option value="today">Due today</option>
                <option value="this-week">Due this week</option>
                <option value="no-due-date">No due date</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-zinc-400">Sort by</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="mt-1 w-full bg-zinc-700 text-white px-3 py-2 rounded-md"
              >
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
                <option value="due-soon">Due date soonest</option>
                <option value="due-latest">Due date latest</option>
                <option value="priority">Priority high to low</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {areaTasks.length === 0 ? (
        <div className="rounded-md border border-zinc-700 bg-zinc-800/80 px-6 py-10 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-md bg-purple-600/20 text-purple-300">
            <ClipboardList size={26} />
          </div>

          <h1 className="mb-2 text-2xl font-bold">
            No {selectedAreaLabel.toLowerCase()} tasks yet
          </h1>

          <p className="mx-auto mb-5 max-w-md text-zinc-400">
            Create a task for this area to keep this part of your life
            organized.
          </p>

          <Link
            to="/add-task"
            className="inline-flex items-center gap-2 rounded-md bg-indigo-500 px-4 py-2 font-semibold text-white hover:bg-indigo-600"
          >
            <ListPlus size={18} />
            Add task
          </Link>
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="rounded-md border border-zinc-700 bg-zinc-800/80 px-6 py-10 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-md bg-zinc-700 text-zinc-300">
            <SearchX size={26} />
          </div>
          <h1 className="mb-2 text-2xl font-bold">
            No tasks match your filters
          </h1>
          <p className="mx-auto mb-5 max-w-md text-zinc-400">
            Try changing your search, clearing filters, or creating a new task
            with different details.
          </p>
          <button
            type="button"
            onClick={clearFilters}
            className="rounded-md bg-zinc-700 px-4 py-2 text-white hover:bg-zinc-600"
          >
            Clear filters
          </button>
        </div>
      ) : viewMode === "kanban" ? (
        <KanbanBoard tasks={filteredTasks} onDeleteClick={setTaskToDelete} />
      ) : (
        <div className="grid justify-items-center gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filteredTasks.map((task) => (
            <TaskCard
              task={task}
              key={task._id}
              onDeleteClick={setTaskToDelete}
            />
          ))}
        </div>
      )}

      {taskToDelete && (
        <ConfirmDelete
          title="Delete task?"
          message="This action cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
          onCancel={() => setTaskToDelete(null)}
          onConfirm={handleDeleteTask}
        />
      )}
    </div>
  );
}

export default TasksPage;



