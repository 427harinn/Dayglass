import { useEffect, useState } from 'react';
import { AppHeader } from './components/AppHeader';
import { FocusView } from './components/FocusView';
import { SetupView } from './components/SetupView';
import { loadSession, saveSession } from './features/schedule/storage';
import type { AppMode } from './features/schedule/scheduleTypes';
import { useCurrentTime } from './features/time/useCurrentTime';

export default function App() {
  // 画面全体の mode は App が持つ。Setup は編集、Focus は表示を担当する。
  const [mode, setMode] = useState<AppMode>('setup');
  // session は初回だけ storage から読み込み、その後はこの state を正とする。
  const [session, setSession] = useState(loadSession);
  const currentTime = useCurrentTime();

  // 確定した session 変更は localStorage に保存し、再読み込み後も予定を維持する。
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
