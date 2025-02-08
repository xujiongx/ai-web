import { createBrowserRouter } from 'react-router-dom';
import BasicLayout from '../layouts/BasicLayout';
import Home from '../pages/Home';
import Chat from '../pages/Chat';
import Profile from '../pages/Profile';
import ChatDetail from '../pages/ChatDetail';
import Login from '../pages/Login';
import Toolbox from '../pages/Toolbox';
import Couplet from '../pages/Couplet';

const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/',
    element: <BasicLayout />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/chat',
        element: <Chat />,
      },
      {
        path: '/toolbox',
        element: <Toolbox />,
      },
      {
        path: '/profile',
        element: <Profile />,
      },
    ],
  },
  {
    path: '/chat/:id',
    element: <ChatDetail />,
  },
  {
    path: '/couplet',
    element: <Couplet />,
  },
]);

export default router;
