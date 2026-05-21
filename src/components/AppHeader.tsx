import type { AppMode } from '../features/schedule/scheduleTypes';

type AppHeaderProps = {
  mode: AppMode;
  onModeChange: (mode: AppMode) => void;
};

export function AppHeader({ mode, onModeChange }: AppHeaderProps) {
  return (
    <header className="app-header">
      <div>
        <p className="app-header__eyebrow">Schedule timer</p>
        <h1>Dayglass</h1>
      </div>

      <nav className="mode-switch" aria-label="View mode">
        <button
          className={mode === 'setup' ? 'mode-switch__button is-active' : 'mode-switch__button'}
          type="button"
          onClick={() => onModeChange('setup')}
        >
          Setup
        </button>
        <button
          className={mode === 'focus' ? 'mode-switch__button is-active' : 'mode-switch__button'}
          type="button"
          onClick={() => onModeChange('focus')}
        >
          Focus
        </button>
      </nav>
    </header>
  );
}
