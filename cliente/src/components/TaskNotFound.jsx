import { Link } from "react-router-dom";
import { SearchX } from "lucide-react";
import PageGlow from "./PageGlow";

function TaskNotFound({
  title = "Task not found",
  message = "This task does not exist or you no longer have access to it.",
}) {
  return (
    <div className="relative isolate flex min-h-[calc(100vh-120px)] items-start justify-center px-4 py-8">
      <PageGlow />

      <section className="w-full max-w-md rounded-md border border-zinc-700 bg-zinc-800/80 px-6 py-10 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-md bg-zinc-700 text-zinc-300">
          <SearchX size={30} />
        </div>

        <h1 className="mb-2 text-2xl font-bold">{title}</h1>

        <p className="mb-6 text-zinc-400">{message}</p>

        <Link
          to="/tasks"
          className="inline-block rounded-md bg-indigo-600 px-4 py-2 font-semibold text-white hover:bg-indigo-700"
        >
          Back to tasks
        </Link>
      </section>
    </div>
  );
}

export default TaskNotFound;
