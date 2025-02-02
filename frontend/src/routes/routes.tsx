import { createBrowserRouter, Navigate } from "react-router-dom";

import { ErrorDisplay } from "@/components/error-boundary/ErrorBoundary";
import { MainLayout } from "@/components/layout/main-layout/MainLayout";

import About from "@/pages/about/About";
import NotFound from "@/pages/not-found/NotFound";
import ProjectPositions from "@/pages/project-positions/ProjectPositions";

import { FacultyRouter } from "./FacultyRouter";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <ErrorDisplay />,
    children: [
      {
        index: true,
        element: <ProjectPositions />,
      },
      {
        path: "about",
        element: <About />,
      },
      {
        path: "faculty/*",
        element: <FacultyRouter />,
      },
      // Catch any unmatched routes and show 404 page
      {
        path: "404",
        element: <NotFound />,
      },
      {
        path: "*",
        element: <Navigate to="/404" replace />,
      },
    ],
  },
]);
