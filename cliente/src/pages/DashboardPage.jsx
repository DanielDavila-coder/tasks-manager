import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import {
  BarChart3,
  CalendarDays,
  CheckCircle,
  ClipboardList,
  Clock,
  Flag,
  ListChecks,
  Plus,
  TrendingUp,
  TriangleAlert,
} from "lucide-react";
import { useTasks } from "../context/TasksContext";
import LoadingScreen from "../components/LoadingScreen";
import PageGlow from "../components/PageGlow";
import { formatDate } from "../utils/formatDate";
import {
  priorityLabels,
  areaTabs,
  getAreaLabel,
  getTaskArea,
} from "../utils/taskOptions";

function DashboardPage() {
  const { tasks, getTasks, loadingTasks } = useTasks();
  const [areaFilter, setAreaFilter] = useState("all");

  useEffect(() => {
    getTasks();
  }, [getTasks]);

  const dashboardTasks = useMemo(() => {
    if (areaFilter === "all") return tasks;

    return tasks.filter((task) => getTaskArea(task) === areaFilter);
  }, [tasks, areaFilter]);

  const stats = useMemo(() => {
    const total = dashboardTasks.length;
    const pending = dashboardTasks.filter(
      (task) => task.status === "pending",
    ).length;
    const inProgress = dashboardTasks.filter(
      (task) => task.status === "in progress",
    ).length;
    const completed = dashboardTasks.filter(
      (task) => task.status === "completed",
    ).length;

    const urgent = dashboardTasks.filter(
      (task) => task.priority === "urgent",
    ).length;
    const high = dashboardTasks.filter(
      (task) => task.priority === "high",
    ).length;
    const medium = dashboardTasks.filter(
      (task) => task.priority === "medium",
    ).length;
    const low = dashboardTasks.filter((task) => task.priority === "low").length;

    const today = dayjs().startOf("day");
    const overdue = dashboardTasks.filter(
      (task) =>
        task.status !== "completed" &&
        task.dueDate &&
        dayjs(task.dueDate).isBefore(today),
    ).length;

    const dueToday = dashboardTasks.filter(
      (task) =>
        task.status !== "completed" &&
        task.dueDate &&
        dayjs(task.dueDate).isSame(today, "day"),
    ).length;

    const urgentOpen = dashboardTasks.filter(
      (task) => task.status !== "completed" && task.priority === "urgent",
    ).length;

    const completedPercent = total ? Math.round((completed / total) * 100) : 0;

    return {
      total,
      pending,
      inProgress,
      completed,
      urgent,
      high,
      medium,
      low,
      overdue,
      dueToday,
      urgentOpen,
      completedPercent,
    };
  }, [dashboardTasks]);

  const upcomingDeadlines = useMemo(() => {
    const today = dayjs().startOf("day");

    return dashboardTasks
      .filter(
        (task) =>
          task.status !== "completed" &&
          task.dueDate &&
          (dayjs(task.dueDate).isSame(today, "day") ||
            dayjs(task.dueDate).isAfter(today)),
      )
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
      .slice(0, 4);
  }, [dashboardTasks]);

  const barWidth = (value) => {
    if (!stats.total) return "0%";
    return `${Math.round((value / stats.total) * 100)}%`;
  };

  if (loadingTasks) {
    return <LoadingScreen text="Loading dashboard..." />;
  }

  if (tasks.length === 0) {
    return (
      <div className="flex min-h-[calc(100vh-140px)] items-start justify-center px-4 pb-10 pt-6">
        <PageGlow />
        <section className="relative w-full max-w-lg overflow-hidden rounded-md border border-zinc-700 bg-zinc-800/80 p-7 text-center shadow-[0_24px_90px_rgba(147,51,234,0.12)]">
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(147,51,234,0.12),transparent_42%)]" />

          <div className="relative">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-md bg-purple-600/20 text-purple-300">
              <ClipboardList size={34} strokeWidth={1.8} />
            </div>

            <h1 className="mb-3 text-2xl font-bold sm:text-3xl">
              Start creating tasks
            </h1>

            <p className="mx-auto mb-4 max-w-md text-zinc-300">
              Add your first task with a due date, priority, and status. Your
              dashboard will update automatically as you make progress.
            </p>

            <Link
              to="/add-task"
              className="inline-flex items-center gap-2 rounded-md bg-indigo-500 px-5 py-2.5 font-semibold text-white hover:bg-indigo-600"
            >
              <Plus size={18} />
              Create Task
            </Link>

            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-md border border-zinc-700 bg-zinc-900/40 p-3">
                <div className="mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-md bg-yellow-400/15 text-yellow-300">
                  <Clock size={18} />
                </div>
                <h2 className="text-2xl font-bold">0</h2>
                <p className="text-sm text-zinc-400">Pending</p>
              </div>

              <div className="rounded-md border border-zinc-700 bg-zinc-900/40 p-3">
                <div className="mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-md bg-green-500/15 text-green-400">
                  <BarChart3 size={18} />
                </div>
                <h2 className="text-2xl font-bold">0</h2>
                <p className="text-sm text-zinc-400">In progress</p>
              </div>

              <div className="rounded-md border border-zinc-700 bg-zinc-900/40 p-3">
                <div className="mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-md bg-purple-500/15 text-purple-300">
                  <CheckCircle size={18} />
                </div>
                <h2 className="text-2xl font-bold">0</h2>
                <p className="text-sm text-zinc-400">Completed</p>
              </div>
            </div>

            <div className="mt-5 grid gap-3 border-t border-zinc-700 pt-5 text-left text-sm sm:grid-cols-3">
              <div className="flex gap-3">
                <CalendarDays
                  className="mt-0.5 shrink-0 text-purple-300"
                  size={18}
                />
                <div>
                  <p className="font-semibold">Set due dates</p>
                  <p className="mt-1 text-zinc-400">Never miss a deadline.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <Flag className="mt-0.5 shrink-0 text-yellow-300" size={18} />
                <div>
                  <p className="font-semibold">Add priorities</p>
                  <p className="mt-1 text-zinc-400">Focus on what matters.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <BarChart3
                  className="mt-0.5 shrink-0 text-green-400"
                  size={18}
                />
                <div>
                  <p className="font-semibold">Track progress</p>
                  <p className="mt-1 text-zinc-400">See your work grow.</p>
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

      <section className="rounded-md border border-zinc-700 bg-zinc-800/80 p-2 shadow-sm">
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
      </section>

      {stats.total === 0 ? (
        <section className="rounded-md border border-zinc-700 bg-zinc-800/80 px-6 py-10 text-center">
          <h2 className="mb-2 text-2xl font-bold">
            No {getAreaLabel(areaFilter).toLowerCase()} tasks yet
          </h2>

          <p className="mx-auto mb-5 max-w-md text-zinc-400">
            Create a task for this area to start tracking its progress.
          </p>

          <Link
            to="/add-task"
            className="inline-flex items-center gap-2 rounded-md bg-indigo-500 px-4 py-2 font-semibold text-white hover:bg-indigo-600"
          >
            <Plus size={18} />
            Add task
          </Link>
        </section>
      ) : (
        <>
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="bg-zinc-800 p-5 rounded-md">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-zinc-400 text-sm">Total Tasks</p>
                <ClipboardList size={22} className="text-purple-300" />
              </div>
              <h2 className="text-3xl font-bold">{stats.total}</h2>
            </div>

            <div className="bg-zinc-800 p-5 rounded-md">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-zinc-400 text-sm">Completed</p>
                <CheckCircle size={22} className="text-purple-300" />
              </div>
              <h2 className="text-3xl font-bold">{stats.completed}</h2>
            </div>

            <div className="bg-zinc-800 p-5 rounded-md">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-zinc-400 text-sm">In progress</p>
                <BarChart3 size={22} className="text-green-400" />
              </div>
              <h2 className="text-3xl font-bold">{stats.inProgress}</h2>
            </div>

            <div className="bg-zinc-800 p-5 rounded-md">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-zinc-400 text-sm">Overdue</p>
                <TriangleAlert size={22} className="text-red-400" />
              </div>
              <h2 className="text-3xl font-bold">{stats.overdue}</h2>
            </div>
          </section>

          <section className="bg-zinc-800 p-5 rounded-md sm:p-6">
            <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="flex items-center gap-2 text-xl font-bold">
                <TrendingUp size={22} className="text-purple-300" />
                Overall progress
              </h2>
              <span>{stats.completedPercent}%</span>
            </div>
            <div className="h-3 bg-zinc-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-purple-700"
                style={{ width: `${stats.completedPercent}%` }}
              />
            </div>
          </section>

          <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-zinc-800 p-6 rounded-md space-y-4">
              <h2 className="flex items-center gap-2 text-xl font-bold">
                <ListChecks size={22} className="text-green-400" />
                Tasks by status
              </h2>

              {[
                ["Pending", stats.pending, "bg-yellow-400"],
                ["In progress", stats.inProgress, "bg-green-600"],
                ["Completed", stats.completed, "bg-purple-600"],
              ].map(([label, value, color]) => (
                <div key={label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{label}</span>
                    <span>{value}</span>
                  </div>
                  <div className="h-2 bg-zinc-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${color}`}
                      style={{ width: barWidth(value) }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-zinc-800 p-6 rounded-md space-y-4">
              <h2 className="flex items-center gap-2 text-xl font-bold">
                <Flag size={22} className="text-yellow-300" />
                Tasks by priority
              </h2>

              {[
                ["Urgent", stats.urgent, "bg-red-500"],
                ["High", stats.high, "bg-orange-500"],
                ["Medium", stats.medium, "bg-blue-500"],
                ["Low", stats.low, "bg-pink-400"],
              ].map(([label, value, color]) => (
                <div key={label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{label}</span>
                    <span>{value}</span>
                  </div>
                  <div className="h-2 bg-zinc-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${color}`}
                      style={{ width: barWidth(value) }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-zinc-800 p-5 rounded-md sm:p-6">
              <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="flex items-center gap-2 text-xl font-bold">
                  <CalendarDays size={22} className="text-purple-300" />
                  Upcoming deadlines
                </h2>

                <span className="text-sm text-zinc-400">
                  {upcomingDeadlines.length} tasks
                </span>
              </div>

              {upcomingDeadlines.length > 0 ? (
                <div className="space-y-3">
                  {upcomingDeadlines.map((task) => (
                    <Link
                      key={task._id}
                      to={`/tasks/${task._id}`}
                      className="block rounded-md border border-zinc-700 bg-zinc-900/40 p-4 hover:border-purple-500/40 hover:bg-zinc-900/70"
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0">
                          <h3 className="font-semibold line-clamp-1">
                            {task.title}
                          </h3>
                          <p className="mt-1 text-sm text-zinc-400">
                            {priorityLabels[task.priority] || task.priority}{" "}
                            priority
                          </p>
                        </div>

                        <div className="text-sm sm:text-right">
                          <p className="text-zinc-400">Due</p>
                          <p className="font-semibold text-white">
                            {formatDate(task.dueDate)}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="rounded-md border border-zinc-700 bg-zinc-900/40 p-5 text-center text-zinc-400">
                  No upcoming deadlines.
                </div>
              )}
            </div>

            <div className="bg-zinc-800 p-5 rounded-md sm:p-6">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-xl font-bold">
                  <TriangleAlert size={22} className="text-red-400" />
                  Needs attention
                </h2>
              </div>

              <div className="space-y-3">
                <div className="flex flex-col gap-3 rounded-md border border-red-500/20 bg-red-500/10 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-semibold">Overdue tasks</p>
                    <p className="text-sm text-zinc-400">
                      Tasks past their due date.
                    </p>
                  </div>
                  <span className="text-2xl font-bold">{stats.overdue}</span>
                </div>

                <div className="flex flex-col gap-3 rounded-md border border-yellow-500/20 bg-yellow-500/10 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-semibold">Due today</p>
                    <p className="text-sm text-zinc-400">
                      Tasks that need attention today.
                    </p>
                  </div>
                  <span className="text-2xl font-bold">{stats.dueToday}</span>
                </div>

                <div className="flex flex-col gap-3 rounded-md border border-purple-500/20 bg-purple-500/10 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-semibold">Open urgent tasks</p>
                    <p className="text-sm text-zinc-400">
                      Urgent tasks not completed yet.
                    </p>
                  </div>
                  <span className="text-2xl font-bold">{stats.urgentOpen}</span>
                </div>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}

export default DashboardPage;

