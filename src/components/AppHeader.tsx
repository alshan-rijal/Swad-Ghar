import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth';
import { APP_NAME } from '../config';
import { Logo } from './Logo';
import { Button } from './ui';

/** Red top bar: logo, signed-in name, extra actions, log out. */
export function AppHeader({ subtitle, right }: { subtitle?: string; right?: ReactNode }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="app-header">
      <div className="app-header__brand">
        <Logo size={34} />
        <div>
          <strong>{user?.name}</strong>
          <span>{subtitle ?? APP_NAME}</span>
        </div>
      </div>
      <div className="app-header__actions">
        {right}
        <Button
          className="btn--ghost"
          onClick={async () => {
            await logout();
            navigate('/login', { replace: true });
          }}
        >
          Log out
        </Button>
      </div>
    </header>
  );
}
