import { ErrorDisplay } from "@/components/error-boundary/ErrorBoundary";
import { MainLayout } from "@/components/layout/mainLayout/MainLayout";
import About from "@/pages/about/About";
import Listings from "@/pages/listings/Listings";
import NotFound from "@/pages/not-found/NotFound";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { FacultyRouter } from "./FacultyRouter";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <ErrorDisplay />,
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
