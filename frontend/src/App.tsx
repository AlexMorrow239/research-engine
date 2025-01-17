import { useState, isValidElement } from 'react';
import { useRoutes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { routes } from './routes';
import { type RouteObject } from 'react-router-dom';

import './App.css';

function App(): JSX.Element {
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);

  // Update routes with current selectedJobId
  const routesWithState: RouteObject[] = routes.map(route => {
    if (route.children) {
      return {
        ...route,
        children: route.children.map(child => {
          if (child.path === '/' && child.element && isValidElement(child.element)) {
            return {
              ...child,
              element: (
                <child.element.type
                  {...child.element.props}
                  selectedJobId={selectedJobId}
                  onJobClick={setSelectedJobId}
                />
              ),
            };
          }
          return child;
        }),
      };
    }
    return route;
  });

  return (
    <AuthProvider>
      {useRoutes(routesWithState)}
    </AuthProvider>
  );
}

export default App;