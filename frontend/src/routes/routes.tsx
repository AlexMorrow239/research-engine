import { MainLayout } from "@/components/layout/mainLayout/MainLayout";
import ProjectDashboard from "@/pages/projects/projectDashboard/ProjectDashboard";
import { ProjectForm } from "@/pages/projects/projectForm/projectForm";
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
    children: [
      {
        index: true,
        element: <Listings />,
      },
      {
        path: "about",
        element: <About />,
      },
      {
        path: "faculty/login",
        element: <FacultyLogin />,
      },
      {
        path: "faculty/register",
        element: <FacultyRegistration />,
      },
      {
        path: "faculty",
        element: <ProtectedLayout />,
        children: [
          {
            path: "dashboard",
            element: <ProjectDashboard />,
          },
          {
            path: "projects/new",
            element: <ProjectForm mode="create" />,
          },
          {
            path: "projects/:projectId/edit",
            element: <ProjectForm mode="edit" />,
          },
        ],
      },
    ],
  },
]);
