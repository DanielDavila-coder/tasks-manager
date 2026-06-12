import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import LoadingScreen from "./components/LoadingScreen";

function ProtectedRoutes() {
  const { loading, isAuthenticated } = useAuth();

  if (loading) return <LoadingScreen text="Loading profile..." />;
  if (!loading && !isAuthenticated) return <Navigate to="/login" replace />;

  return <Outlet />;
}
export default ProtectedRoutes;
