import { BrowserRouter } from 'react-router-dom';
import { AppProviders } from './providers/app-providers';
import { useSession } from './providers/session.provider';
import { AppRouter } from './router/app-router';

export default function App() {
  return (
    <AppProviders>
      <BrowserRouter>
        <SessionLayout />
      </BrowserRouter>
    </AppProviders>
  );
}

function SessionLayout() {
  const { session } = useSession();
  const shell = <AppRouter />;
  return session ? <div className="h-screen overflow-hidden">{shell}</div> : shell;
}
