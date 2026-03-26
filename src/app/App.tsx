import { RouterProvider } from 'react-router';
import { router } from './routes';
import '../utils/console-helper';

export default function App() {
  return <RouterProvider router={router} />;
}