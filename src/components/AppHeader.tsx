import type { AppMode } from '../features/schedule/scheduleTypes';

type AppHeaderProps = {
  mode: AppMode;
  onModeChange: (mode: AppMode) => void;
};

export function AppHeader({ mode, onModeChange }: AppHeaderProps) {
  return (
    <header className={mode === 'focus' ? 'app-header app-header--focus' : 'app-header'}>
      <div>
        <p className="app-header__eyebrow">スケジュールタイマー</p>
        <h1>Dayglass</h1>
      </div>

      <nav className="mode-switch" aria-label="表示モード">
        <button
          className={mode === 'setup' ? 'mode-switch__button is-active' : 'mode-switch__button'}
          type="button"
          onClick={() => onModeChange('setup')}
        >
          設定
        </button>
        <button
          className={mode === 'focus' ? 'mode-switch__button is-active' : 'mode-switch__button'}
          type="button"
          onClick={() => onModeChange('focus')}
        >
          作業中
        </button>
      </nav>
    </header>
  );
}
