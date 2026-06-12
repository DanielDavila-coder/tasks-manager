import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { isAuthenticated, logout, user } = useAuth();
  const location = useLocation();
  const pathname = location.pathname;

  const isDashboardPage = pathname === "/dashboard";
  const isTasksPage = pathname === "/tasks";
  const isAddTaskPage = pathname === "/add-task";
  const isProfilePage = pathname === "/profile";
  const isEditTaskPage = pathname.endsWith("/edit");

  const navLinkClass =
    "block rounded-md bg-zinc-600 px-4 py-2 text-center font-semibold hover:bg-zinc-500";

  return (
    <nav className="my-3 flex flex-col items-center gap-4 rounded-lg bg-zinc-700 px-4 py-5 text-center lg:flex-row lg:justify-between lg:px-10 lg:text-left">
      <Link to={isAuthenticated ? "/dashboard" : "/"}>
        <h1 className="text-3xl font-bold sm:text-4xl lg:text-3xl">
          Tasks Manager
        </h1>
      </Link>

      {isAuthenticated ? (
        <div className="flex w-full flex-col items-center gap-3 lg:w-auto lg:flex-row lg:gap-4">
          <p className="text-center text-zinc-100 lg:text-left">
            Welcome {user?.username}
          </p>

          <ul className="grid w-full max-w-[520px] grid-cols-2 gap-2 sm:flex sm:max-w-none sm:flex-wrap sm:justify-center sm:gap-x-6 sm:gap-y-2 lg:w-auto lg:flex-nowrap lg:gap-3">
            {!isDashboardPage && (
              <li>
                <Link to="/dashboard" className={navLinkClass}>
                  Dashboard
                </Link>
              </li>
            )}

            {!isTasksPage && (
              <li>
                <Link to="/tasks" className={navLinkClass}>
                  Tasks
                </Link>
              </li>
            )}

            {!isAddTaskPage && !isEditTaskPage && (
              <li>
                <Link to="/add-task" className={navLinkClass}>
                  Add task
                </Link>
              </li>
            )}

            {!isProfilePage && (
              <li>
                <Link to="/profile" className={navLinkClass}>
                  Profile
                </Link>
              </li>
            )}

            <li>
              <Link
                to="/"
                onClick={() => logout()}
                className="block rounded-md bg-zinc-600 px-4 py-2 text-center font-semibold hover:bg-zinc-500"
              >
                Logout
              </Link>
            </li>
          </ul>
        </div>
      ) : (
        <ul className="flex flex-wrap justify-center gap-3">
          <li>
            <Link to="/login" className={navLinkClass}>
              Login
            </Link>
          </li>
          <li>
            <Link to="/register" className={navLinkClass}>
              Register
            </Link>
          </li>
        </ul>
      )}
    </nav>
  );
}

export default Navbar;

