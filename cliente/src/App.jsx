import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { TasksProvider } from "./context/TasksContext";
import { NotificationProvider } from "./context/NotificationContext";

import Notification from "./components/Notification";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import TasksPage from "./pages/TasksPage";
import TasksFormPage from "./pages/TasksFormPage";
import ProfilePage from "./pages/ProfilePage";
import HomePage from "./pages/HomePage";
import TaskDetailPage from "./pages/TaskDetailPage";
import DashboardPage from "./pages/DashboardPage";
import NotFoundPage from "./pages/NotFoundPage";

import ProtectedRoutes from "./ProtectedRoutes";
import Navbar from "./components/Navbar";

function App() {
  return (
    <AuthProvider>
      <TasksProvider>
        <NotificationProvider>
          <BrowserRouter>
            <main className="container mx-auto mb-12 px-4 sm:px-6 lg:px-12">
              <Navbar />
              <Notification />
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                <Route element={<ProtectedRoutes />}>
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/tasks" element={<TasksPage />} />
                  <Route path="/add-task" element={<TasksFormPage />} />
                  <Route path="/tasks/:id" element={<TaskDetailPage />} />
                  <Route path="/tasks/:id/edit" element={<TasksFormPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                </Route>

                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </main>
          </BrowserRouter>
        </NotificationProvider>
      </TasksProvider>
    </AuthProvider>
  );
}

export default App;
