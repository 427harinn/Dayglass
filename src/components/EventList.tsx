import { eventTypeLabels } from '../features/schedule/defaultSession';
import { getEventColor } from '../features/schedule/scheduleUtils';
import type { DayglassEvent } from '../features/schedule/scheduleTypes';

type EventListProps = {
  events: DayglassEvent[];
  onDeleteEvent: (eventId: string) => void;
};

export function EventList({ events, onDeleteEvent }: EventListProps) {
  return (
    <div className="event-list">
      {events.map((event) => (
        <article className="event-row" key={event.id}>
          <span
            className="event-row__color"
            style={{ backgroundColor: getEventColor(event) }}
            aria-hidden="true"
          />
          <div className="event-row__body">
            <div className="event-row__main">
              <strong>{event.title}</strong>
              <span>{event.startTime} - {event.endTime ?? '未設定'}</span>
            </div>
            <p>{eventTypeLabels[event.type]}{event.memo ? ` / ${event.memo}` : ''}</p>
          </div>
          <button
            className="event-row__delete"
            type="button"
            aria-label={`${event.title}を削除`}
            onClick={() => onDeleteEvent(event.id)}
          >
            削除
          </button>
        </article>
      ))}
    </div>
  );
}
