import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../layout/MainLayout';
import Home from '../pages/Home';
import Services from '../pages/Services';
import Gallery from '../pages/Gallery';
import Order from '../pages/Order';
import Contact from '../pages/Contact';
import AdminDashboard from '../pages/Admin/Dashboard';

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
      { path: '/admin', element: <AdminDashboard /> },
    ],
  },
]);

export default router;