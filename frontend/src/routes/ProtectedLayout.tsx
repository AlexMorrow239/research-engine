import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useAppSelector } from "@/store";

export const ProtectedLayout = (): JSX.Element => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const location = useLocation();

  if (!isAuthenticated) {
    // Save the attempted location for post-login redirect
    return <Navigate to="/faculty" state={{ from: location }} replace />;
  }

  return <Outlet />;
};
