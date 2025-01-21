import { useAppSelector } from "@/store";
import { Navigate, Outlet, useLocation } from "react-router-dom";

export const ProtectedLayout = (): JSX.Element => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/faculty" state={{ from: location }} replace />;
  }

  return <Outlet />;
};
