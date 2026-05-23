import { useEffect, useState } from 'react';
import { AppHeader } from './components/AppHeader';
import { FocusView } from './components/FocusView';
import { SetupView } from './components/SetupView';
import { loadSession, saveSession } from './features/schedule/storage';
import type { AppMode } from './features/schedule/scheduleTypes';

const CURRENT_TIME_REFRESH_MS = 60 * 1000;

const formatCurrentTime = (date: Date) => {
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};

export default function App() {
  const [mode, setMode] = useState<AppMode>('setup');
  const [session, setSession] = useState(loadSession);
  const [currentTime, setCurrentTime] = useState(() => formatCurrentTime(new Date()));

  useEffect(() => {
    saveSession(session);
  }, [session]);

  useEffect(() => {
    const timerId = window.setInterval(() => {
      setCurrentTime(formatCurrentTime(new Date()));
    }, CURRENT_TIME_REFRESH_MS);

    return () => {
      window.clearInterval(timerId);
    };
  }, []);

  return (
    <div className="app-shell">
      <AppHeader mode={mode} onModeChange={setMode} />
      {mode === 'setup' ? (
        <SetupView session={session} onSessionChange={setSession} />
      ) : (
        <FocusView session={session} currentTime={currentTime} />
      )}
    </div>
  );
}
