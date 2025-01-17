import { Outlet } from "react-router-dom";
import { ProtectedRoute } from "../components/ProtectedRoutes";

export const ProtectedLayout = () => {
  return (
    <ProtectedRoute>
      <Outlet />
    </ProtectedRoute>
  );
};
