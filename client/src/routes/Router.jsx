
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import MainLayout from '../layout/MainLayout';
import Home from '../pages/Home';
import Services from '../pages/Services';
import Gallery from '../pages/Gallery';
import Order from '../pages/Order';
import Contact from '../pages/Contact';
import AdminDashboard from '../pages/Admin/Dashboard';
import Login from '../pages/Auth/Login';
import Register from '../pages/Auth/Register';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/services', element: <Services /> },
      { path: '/gallery', element: <Gallery /> },
      { path: '/order', element: <Order /> },
      { path: '/contact', element: <Contact /> },
      { 
        path: '/admin', 
        element: <AdminDashboard />,
      },
    ],
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);

const AppRouter = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;