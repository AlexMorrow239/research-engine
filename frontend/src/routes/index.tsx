import { type RouteObject } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout/MainLayout';
import ProtectedRoute from '../components/ProtectedRoutes';
import JobApplication from '../components/JobApplication/JobApplication';
import About from '../pages/About/About';
import Home from '../pages/Home/Home';
import ListPosition from '../pages/ListPosition/ListPosition';
import LoginPage from '../pages/Login/Login';
import ProfessorRegister from '../pages/ProfessorRegister/ProfessorRegister';
import YourListings from '../pages/YourListings/YourListings';

// Data
import jobData from '../data/jobData';

export const routes: RouteObject[] = [
  {
    element: <MainLayout />,
    children: [
      // Public Routes
      {
        path: '/',
        element: <Home jobData={jobData} selectedJobId={null} onJobClick={() => {}} />,
      },
      {
        path: '/about',
        element: <About onNavigate={() => {}} />,
      },
      {
        path: '/login',
        element: <LoginPage />,
      },
      {
        path: '/professor-register',
        element: <ProfessorRegister />,
      },

      // Protected Routes
      {
        path: '/listposition',
        element: (
          <ProtectedRoute>
            <ListPosition />
          </ProtectedRoute>
        ),
      },
      {
        path: '/your-listings',
        element: (
          <ProtectedRoute>
            <YourListings />
          </ProtectedRoute>
        ),
      },
      {
        path: '/job/:id/apply',
        element: (
          <ProtectedRoute>
            <JobApplication jobData={jobData} />
          </ProtectedRoute>
        ),
      },
    ],
  },
];