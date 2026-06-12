import { Link, useLocation } from "react-router-dom";
import { ArrowLeft, Home, SearchX } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import LoadingScreen from "../components/LoadingScreen";
import PageGlow from "../components/PageGlow";

function NotFoundPage() {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingScreen text="Checking page..." />;
  }

  const mainLink = isAuthenticated ? "/dashboard" : "/";
  const mainLabel = isAuthenticated ? "Go to dashboard" : "Go home";

  return (
    <div className="relative isolate flex min-h-[calc(100vh-120px)] items-start justify-center px-4 py-8">
      <PageGlow />

      <section className="w-full max-w-lg rounded-md border border-zinc-700 bg-zinc-800/80 px-6 py-10 text-center shadow-xl">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-md bg-purple-950/60 text-purple-300">
          <SearchX size={34} />
        </div>

        <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-purple-300">
          404 error
        </p>

        <h1 className="mb-3 text-3xl font-bold text-white">
          Page not found
        </h1>

        <p className="mx-auto mb-3 max-w-sm text-zinc-400">
          The page you are looking for does not exist or may have been moved.
        </p>

        <p className="mx-auto mb-7 max-w-sm break-words rounded-md bg-zinc-900/50 px-3 py-2 text-sm text-zinc-500">
          {location.pathname}
        </p>

        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            to={mainLink}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-indigo-600 px-4 py-2 font-semibold text-white hover:bg-indigo-700"
          >
            <Home size={18} />
            {mainLabel}
          </Link>

          {isAuthenticated && (
            <Link
              to="/tasks"
              className="inline-flex items-center justify-center gap-2 rounded-md bg-zinc-700 px-4 py-2 font-semibold text-white hover:bg-zinc-600"
            >
              <ArrowLeft size={18} />
              Back to tasks
            </Link>
          )}
        </div>
      </section>
    </div>
  );
}

export default NotFoundPage;
