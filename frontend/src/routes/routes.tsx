import { createBrowserRouter } from "react-router-dom";
import { ProtectedLayout } from "./protected";
import About from "../pages/about/About";
import FacultyLogin from "../pages/facultyLogin/FacultyLogin";
import FacultyRegistration from "../pages/facultyRegistration/FacultyRegistration";
import ListPosition from "../pages/listPosition/ListPosition";
import Positions from "../pages/positions/Positions";
import { MainLayout } from "@/components/layout/mainLayout/MainLayout";
import ProjectDashboard from "@/pages/projectDashboard/ProjectDashboard";
import { NewProject } from "@/pages/projects/NewProject";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Positions />,
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
            path: "list-position",
            element: <ListPosition />,
          },
          {
            path: "dashboard",
            element: <ProjectDashboard />,
          },
          {
            path: "projects/new",
            element: <NewProject />,
          },
        ],
      },
    ],
  },
]);
