import ErrorBoundary, {
  ErrorDisplay,
} from "@/components/error-boundary/ErrorBoundary";
import { MainLayout } from "@/components/layout/mainLayout/MainLayout";
import ProjectDashboard from "@/pages/projects/projectDashboard/ProjectDashboard";
import { ProjectForm } from "@/pages/projects/projectForm/ProjectForm";
import { createBrowserRouter } from "react-router-dom";
import About from "../pages/about/About";
import FacultyLogin from "../pages/auth/facultyLogin/FacultyLogin";
import FacultyRegistration from "../pages/auth/facultyRegistration/FacultyRegistration";
import Listings from "../pages/listings/Listings";
import { ProtectedLayout } from "./protected";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <ErrorDisplay />,
    children: [
      {
        index: true,
        element: (
          <ErrorBoundary>
            <Listings />
          </ErrorBoundary>
        ),
      },
      {
        path: "about",
        element: (
          <ErrorBoundary>
            <About />
          </ErrorBoundary>
        ),
      },
      {
        path: "faculty/login",
        element: (
          <ErrorBoundary>
            <FacultyLogin />
          </ErrorBoundary>
        ),
      },
      {
        path: "faculty/register",
        element: (
          <ErrorBoundary>
            <FacultyRegistration />
          </ErrorBoundary>
        ),
      },
      {
        path: "faculty",
        element: <ProtectedLayout />,
        errorElement: <ErrorDisplay />,
        children: [
          {
            path: "dashboard",
            element: (
              <ErrorBoundary>
                <ProjectDashboard />
              </ErrorBoundary>
            ),
          },
          {
            path: "projects/new",
            element: (
              <ErrorBoundary>
                <ProjectForm mode="create" />
              </ErrorBoundary>
            ),
          },
          {
            path: "projects/:projectId/edit",
            element: (
              <ErrorBoundary>
                <ProjectForm mode="edit" />
              </ErrorBoundary>
            ),
          },
        ],
      },
    ],
  },
]);
