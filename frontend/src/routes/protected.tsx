import { Outlet } from "react-router-dom";
import { ProtectedRoute } from "../components/routes/ProtectedRoutes";

export const ProtectedLayout = (): JSX.Element => {
  return (
    <ProtectedRoute>
      <Outlet />
    </ProtectedRoute>
  );
};
