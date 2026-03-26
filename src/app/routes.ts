import { createBrowserRouter } from 'react-router';
import { IntroPage } from './pages/IntroPage';
import { ChatPage } from './pages/ChatPage';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: IntroPage,
  },
  {
    path: '/chat',
    Component: ChatPage,
  },
]);
