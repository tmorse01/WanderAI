import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { HomePage } from './pages/Home.page';
import { MapPage } from './pages/Map.page';

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  { path: '/map', element: <MapPage /> },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
