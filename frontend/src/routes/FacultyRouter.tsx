import { Navigate, Route, Routes } from "react-router-dom";

import FacultyLogin from "@/pages/auth/faculty-login/FacultyLogin";
import FacultyRegistration from "@/pages/auth/faculty-registration/FacultyRegistration";
import { FacultyAccount } from "@/pages/faculty-account/FacultyAccount";
import ProjectDashboard from "@/pages/projects/project-dashboard/ProjectDashboard";
import { ProjectForm } from "@/pages/projects/project-form/ProjectForm";
import { ResetPassword } from "@/pages/reset-password/ResetPassword";
import { useAppSelector } from "@/store";

import { ProtectedLayout } from "./ProtectedLayout";

export const FacultyRouter = (): JSX.Element => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  return (
    <Routes>
      {/* Public Routes */}
      <Route
        index
        element={
          isAuthenticated ? (
            <Navigate to="/faculty/dashboard" replace />
          ) : (
            <Navigate to="/faculty/login" replace />
          )
        }
      />
      <Route path="login" element={<FacultyLogin />} />
      <Route path="register" element={<FacultyRegistration />} />
      <Route path="auth/reset-password" element={<ResetPassword />} />

      {/* Protected Routes */}
      <Route element={<ProtectedLayout />}>
        <Route path="dashboard" element={<ProjectDashboard />} />
        <Route path="account" element={<FacultyAccount />} />
        <Route path="projects">
          <Route path="new" element={<ProjectForm mode="create" />} />
          <Route path=":projectId/edit" element={<ProjectForm mode="edit" />} />
        </Route>
      </Route>

      {/* Redirect unmatched faculty routes to 404 */}
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
};
