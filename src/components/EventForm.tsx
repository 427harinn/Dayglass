import { eventTypeLabels } from '../features/schedule/defaultSession';
import type { DayglassSession } from '../features/schedule/scheduleTypes';

type EventFormProps = {
  session: DayglassSession;
};

export function EventForm({ session }: EventFormProps) {
  return (
    <form className="form-shell">
      <div className="form-grid">
        <label>
          セッション名
          <input value={session.title} readOnly />
        </label>
        <label>
          日付
          <input value={session.date} readOnly />
        </label>
        <label>
          開始
          <input value={session.startTime} readOnly />
        </label>
        <label>
          終了
          <input value={session.endTime} readOnly />
        </label>
      </div>

      <div className="event-draft">
        <label>
          イベント名
          <input placeholder="新しいイベント" readOnly />
        </label>
        <label>
          種別
          <select value="work" disabled>
            {Object.entries(eventTypeLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <label>
          開始
          <input placeholder="14:00" readOnly />
        </label>
        <label>
          終了
          <input placeholder="15:00" readOnly />
        </label>
      </div>

      <button className="secondary-button" type="button">
        イベントを追加
      </button>
    </form>
  );
}
