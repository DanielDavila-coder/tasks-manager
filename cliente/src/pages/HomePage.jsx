import {
  BarChart3,
  Briefcase,
  CalendarDays,
  ClipboardList,
  TriangleAlert,
} from "lucide-react";
import { Link } from "react-router-dom";
import PageGlow from "../components/PageGlow";

const previewTasks = [
  {
    title: "Design portfolio case study",
    area: "Work",
    priority: "High",
    due: "May 23",
    status: "In progress",
    statusClass: "bg-green-600",
  },
  {
    title: "Review database notes",
    area: "Study",
    priority: "Medium",
    due: "May 26",
    status: "Pending",
    statusClass: "bg-yellow-500",
  },
  {
    title: "Plan weekend errands",
    area: "Personal",
    priority: "Urgent",
    due: "May 30",
    status: "Completed",
    statusClass: "bg-purple-600",
  },
];

const features = [
  {
    title: "Plan every task",
    description:
      "Save details, due dates, priority, status, and area in one place.",
    icon: ClipboardList,
    iconClass: "bg-purple-600/15 text-purple-300",
  },
  {
    title: "Focus by area",
    description:
      "Separate work, study, and personal tasks without mixing your day.",
    icon: Briefcase,
    iconClass: "bg-blue-600/15 text-blue-300",
  },
  {
    title: "Track real progress",
    description:
      "Review deadlines, urgent work, overdue tasks, and completion by area.",
    icon: BarChart3,
    iconClass: "bg-green-600/15 text-green-300",
  },
];

const steps = [
  {
    title: "Create your account",
    description: "Sign up in seconds and open your personal workspace.",
  },
  {
    title: "Add your first tasks",
    description: "Capture work, study, and personal responsibilities.",
  },
  {
    title: "Track what matters",
    description: "Review progress, deadlines, urgent tasks, and overdue work.",
  },
  {
    title: "Complete your goals",
    description: "Update status and keep your dashboard moving.",
  },
];

function HomePage() {
  return (
    <div className="relative isolate overflow-hidden">
      <PageGlow />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_80%_10%,rgba(147,51,234,0.18),transparent_40%)]" />

      <div className="pb-2">
        <section className="grid items-center gap-10 py-6 lg:grid-cols-[1fr_0.95fr] lg:py-8">
          <div className="max-w-2xl">
            <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-purple-300">
              Task planning made clear
            </p>

            <h1 className="text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
              Organize your work.
            </h1>

            <p className="mt-5 max-w-xl text-lg leading-8 text-zinc-300">
              Organize your tasks by work, study, and personal areas. Set
              priorities, follow deadlines, and understand your progress from a
              dashboard built for daily work.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/register"
                className="rounded-md bg-purple-600 px-5 py-3 text-center font-semibold text-white hover:bg-purple-700"
              >
                Get started
              </Link>
              <Link
                to="/login"
                className="rounded-md bg-zinc-700 px-5 py-3 text-center font-semibold text-white hover:bg-zinc-600"
              >
                Sign in
              </Link>
            </div>

            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              {features.map((feature) => (
                <article
                  key={feature.title}
                  className="rounded-md border border-zinc-700 bg-zinc-800 p-4 shadow-lg shadow-black/10"
                >
                  <div
                    className={`${feature.iconClass} mb-4 flex h-10 w-10 items-center justify-center rounded-md`}
                  >
                    <feature.icon size={22} strokeWidth={2.2} />
                  </div>
                  <h2 className="font-semibold text-white">{feature.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-zinc-300">
                    {feature.description}
                  </p>
                </article>
              ))}
            </div>
          </div>

          <div className="rounded-md border border-zinc-700 bg-zinc-900 p-4 shadow-2xl shadow-black/30">
            <div className="mb-4 flex items-center justify-between border-b border-zinc-800 pb-4">
              <div>
                <p className="text-sm text-zinc-400">Dashboard preview</p>
                <h2 className="text-xl font-bold">Today&apos;s focus</h2>
              </div>
              <span className="rounded-md bg-purple-600 px-3 py-2 text-sm font-semibold">
                72% done
              </span>
            </div>

            <div className="mb-5 grid grid-cols-4 gap-2 rounded-md bg-zinc-950/40 p-2 text-center text-xs font-semibold text-zinc-300">
              <span className="rounded-md bg-purple-600 px-2 py-2 text-white">
                All
              </span>
              <span className="rounded-md bg-zinc-800 px-2 py-2">Work</span>
              <span className="rounded-md bg-zinc-800 px-2 py-2">Study</span>
              <span className="rounded-md bg-zinc-800 px-2 py-2">
                Personal
              </span>
            </div>

            <div className="mb-5">
              <div className="mb-2 flex items-center justify-between text-sm text-zinc-400">
                <span>Overall progress</span>
                <span>72%</span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-zinc-700">
                <div className="h-full w-[72%] rounded-full bg-purple-600"></div>
              </div>
            </div>

            <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-md bg-zinc-800 p-3">
                <p className="text-xs text-zinc-400">Pending</p>
                <p className="mt-1 text-2xl font-bold">4</p>
              </div>
              <div className="rounded-md bg-zinc-800 p-3">
                <p className="text-xs text-zinc-400">In progress</p>
                <p className="mt-1 text-2xl font-bold">3</p>
              </div>
              <div className="rounded-md bg-zinc-800 p-3">
                <p className="text-xs text-zinc-400">Completed</p>
                <p className="mt-1 text-2xl font-bold">9</p>
              </div>
            </div>

            <div className="mb-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-md border border-zinc-700 bg-zinc-800 p-3">
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-purple-300">
                  <CalendarDays size={16} />
                  Upcoming
                </div>
                <p className="text-sm text-zinc-300">3 deadlines this week</p>
              </div>

              <div className="rounded-md border border-red-500/20 bg-red-500/10 p-3">
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-red-300">
                  <TriangleAlert size={16} />
                  Attention
                </div>
                <p className="text-sm text-zinc-300">2 overdue tasks</p>
              </div>
            </div>

            <div className="space-y-3">
              {previewTasks.map((task) => (
                <article
                  key={task.title}
                  className="rounded-md border border-zinc-700 bg-zinc-800 p-4"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 className="font-semibold text-white">{task.title}</h3>
                      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-zinc-300">
                        <span>Area: {task.area}</span>
                        <span>Priority: {task.priority}</span>
                        <span>Due: {task.due}</span>
                      </div>
                    </div>
                    <span
                      className={`${task.statusClass} w-fit whitespace-nowrap rounded-md px-3 py-2 text-sm font-semibold text-white`}
                    >
                      {task.status}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-zinc-800 py-10">
          <h2 className="text-center text-2xl font-bold">How it works</h2>

          <div className="mt-8 grid gap-4 md:grid-cols-4">
            {steps.map((step, index) => (
              <article
                key={step.title}
                className="rounded-md bg-zinc-800 p-5 text-center"
              >
                <span className="mx-auto flex h-9 w-9 items-center justify-center rounded-md bg-purple-600 font-bold">
                  {index + 1}
                </span>
                <h3 className="mt-4 font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-400">
                  {step.description}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-md bg-zinc-800 px-6 py-6 text-center">
          <h2 className="text-2xl font-bold">Ready to organize your work?</h2>
          <p className="mx-auto max-w-2xl text-zinc-300">
            Start with one task, then use areas and dashboard insights to
            understand your progress as your list grows.
          </p>
          <Link
            to="/register"
            className="mt-6 inline-block rounded-md bg-purple-600 px-5 py-3 font-semibold hover:bg-purple-700"
          >
            Create account
          </Link>
        </section>
      </div>
    </div>
  );
}

export default HomePage;
