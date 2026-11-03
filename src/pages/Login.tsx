import { useState, type FormEvent } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../auth';
import { Logo } from '../components/Logo';
import { Button, Card, Input } from '../components/ui';
import { APP_NAME, APP_TAGLINE } from '../config';
import { HOME_PATH } from '../types';
import './Login.css';

export default function Login() {
  const { user, login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  if (user) return <Navigate to={HOME_PATH[user.role]} replace />;

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      await login(username, password);
      // The redirect above runs once the user is set.
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign in failed');
      setBusy(false);
    }
  }

  return (
    <div className="login">
      <header className="login__brand">
        <Logo size={46} />
        <div>
          <strong>{APP_NAME}</strong>
          <span>{APP_TAGLINE}</span>
        </div>
      </header>

      <Card className="login__sheet">
        <h1 className="login__title">Sign in</h1>
        <form onSubmit={onSubmit} noValidate>
          <Input
            label="Username"
            value={username}
            autoComplete="username"
            autoCapitalize="none"
            placeholder="e.g. ramesh"
            onChange={(e) => setUsername(e.target.value)}
          />
          <Input
            label="Password"
            type="password"
            value={password}
            autoComplete="current-password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className="login__error" role="alert">{error}</p>}
          <Button type="submit" block disabled={busy}>
            {busy ? 'Signing in…' : 'Sign in'}
          </Button>
        </form>

        <p className="muted login__hint">
          Owner, chef and waiter all sign in here.
          <br />
          Demo logins: <code>suresh</code>, <code>bikash</code>, <code>ramesh</code> — password is the
          name plus <code>123</code>.
        </p>
      </Card>
    </div>
  );
}
