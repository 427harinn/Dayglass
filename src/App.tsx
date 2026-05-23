import { useEffect, useState } from 'react';
import { AppHeader } from './components/AppHeader';
import { FocusView } from './components/FocusView';
import { SetupView } from './components/SetupView';
import { loadSession, saveSession } from './features/schedule/storage';
import type { AppMode } from './features/schedule/scheduleTypes';
import { useCurrentTime } from './features/time/useCurrentTime';

export default function App() {
  const [mode, setMode] = useState<AppMode>('setup');
  const [session, setSession] = useState(loadSession);
  const currentTime = useCurrentTime();

  useEffect(() => {
    saveSession(session);
  }, [session]);

  return (
    <div className="app-shell">
      <AppHeader mode={mode} onModeChange={setMode} />
      {mode === 'setup' ? (
        <SetupView session={session} currentTime={currentTime} onSessionChange={setSession} />
      ) : (
        <FocusView session={session} currentTime={currentTime} />
      )}
    </div>
  );
}
