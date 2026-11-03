import { useAuth } from '../auth';
import { AppHeader } from '../components/AppHeader';
import { Card } from '../components/ui';

// Phase 1 placeholder: dashboard, billing, menu, tables and staff come in Phase 3.
export default function Admin() {
  const { user } = useAuth();
  return (
    <>
      <AppHeader subtitle="Owner" />
      <main className="page">
        <Card>
          <h2 className="title">Owner dashboard</h2>
          <p className="muted">
            Signed in as {user?.name} ({user?.role}). Sales stats, open bills, menu, tables and staff
            are built in Phase 3.
          </p>
        </Card>
      </main>
    </>
  );
}
