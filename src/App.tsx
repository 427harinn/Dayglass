import { useState } from 'react';
import { AppHeader } from './components/AppHeader';
import { FocusView } from './components/FocusView';
import { SetupView } from './components/SetupView';
import { defaultSession } from './features/schedule/defaultSession';
import type { AppMode } from './features/schedule/scheduleTypes';

export default function App() {
  const [mode, setMode] = useState<AppMode>('setup');

  return (
    <div className="app-shell">
      <AppHeader mode={mode} onModeChange={setMode} />
      {mode === 'setup' ? (
        <SetupView session={defaultSession} />
      ) : (
        <FocusView session={defaultSession} />
      )}
    </div>
  );
}
