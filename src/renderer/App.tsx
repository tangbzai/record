import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import './App.css';
import Nav from './layout/Nav';
import Index from './pages/Index';

export default function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Nav />,
      children: [
        {
          path: '*',
          element: <Index />,
        },
      ],
    },
  ]);
  return (
    <div className="app">
      <RouterProvider router={router} />
    </div>
  );
}
