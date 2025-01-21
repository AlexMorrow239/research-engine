import FacultyLogin from "@/pages/auth/facultyLogin/FacultyLogin";
import ProjectDashboard from "@/pages/projects/projectDashboard/ProjectDashboard";
import { ProjectForm } from "@/pages/projects/projectForm/ProjectForm";
import { useAppSelector } from "@/store";
import { Navigate, Route, Routes } from "react-router-dom";
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
            <FacultyLogin />
          )
        }
      />

      {/* Protected Routes */}
      <Route element={<ProtectedLayout />}>
        <Route path="dashboard" element={<ProjectDashboard />} />
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
