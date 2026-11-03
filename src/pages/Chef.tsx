import { useAuth } from '../auth';
import { AppHeader } from '../components/AppHeader';
import { Card } from '../components/ui';

// Phase 1 placeholder: the New / Preparing / Ready board comes in Phase 2.
export default function Chef() {
  const { user } = useAuth();
  return (
    <>
      <AppHeader subtitle="Kitchen" />
      <main className="page">
        <Card>
          <h2 className="title">Kitchen board</h2>
          <p className="muted">
            Signed in as {user?.name} ({user?.role}). The New, Preparing and Ready columns are built
            in Phase 2.
          </p>
        </Card>
      </main>
    </>
  );
}
