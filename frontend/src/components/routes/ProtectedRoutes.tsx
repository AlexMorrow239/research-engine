import { Navigate, useLocation } from "react-router-dom";
import { useAppSelector } from "../../store";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/faculty/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
