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
          Session title
          <input value={session.title} readOnly />
        </label>
        <label>
          Date
          <input value={session.date} readOnly />
        </label>
        <label>
          Start
          <input value={session.startTime} readOnly />
        </label>
        <label>
          End
          <input value={session.endTime} readOnly />
        </label>
      </div>

      <div className="event-draft">
        <label>
          Event title
          <input placeholder="New event" readOnly />
        </label>
        <label>
          Type
          <select value="work" disabled>
            {Object.entries(eventTypeLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <label>
          Start
          <input placeholder="14:00" readOnly />
        </label>
        <label>
          End
          <input placeholder="15:00" readOnly />
        </label>
      </div>

      <button className="secondary-button" type="button">
        Add event
      </button>
    </form>
  );
}
