import { createBrowserRouter } from 'react-router-dom';
import BasicLayout from '../layouts/BasicLayout';
import Home from '../pages/Home';
import Chat from '../pages/Chat';
import Profile from '../pages/Profile';
import ChatDetail from '../pages/ChatDetail';

const router = createBrowserRouter([
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
        path: '/profile',
        element: <Profile />,
      },
    ],
  },
  {
    path: '/chat/:id',
    element: <ChatDetail />
  }
]);

export default router;
