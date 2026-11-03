import { useAuth } from '../auth';
import { AppHeader } from '../components/AppHeader';
import { Card } from '../components/ui';

// Phase 1 placeholder: table chips, menu and ordering come in Phase 2.
export default function Waiter() {
  const { user } = useAuth();
  return (
    <>
      <AppHeader subtitle="Waiter" />
      <main className="page">
        <Card>
          <h2 className="title">Waiter screen</h2>
          <p className="muted">
            Signed in as {user?.name} ({user?.role}). Table selection, menu and orders are built in
            Phase 2.
          </p>
        </Card>
      </main>
    </>
  );
}
