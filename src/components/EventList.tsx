import { eventTypeLabels } from '../features/schedule/defaultSession';
import { getEventColor } from '../features/schedule/scheduleUtils';
import type { DayglassEvent } from '../features/schedule/scheduleTypes';

type EventListProps = {
  events: DayglassEvent[];
  editingEventId?: string;
  onEditEvent: (event: DayglassEvent) => void;
  onDeleteEvent: (eventId: string) => void;
};

// EventList は event 一覧を表示し、編集/削除の操作は上位へ委譲する。
export function EventList({
  events,
  editingEventId,
  onEditEvent,
  onDeleteEvent,
}: EventListProps) {
  return (
    <div className="event-list">
      {events.map((event) => (
        <article
          className={event.id === editingEventId ? 'event-row is-editing' : 'event-row'}
          key={event.id}
        >
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
          <div className="event-row__actions">
            <button
              className="event-row__edit"
              type="button"
              aria-label={`${event.title}を編集`}
              onClick={() => onEditEvent(event)}
            >
              編集
            </button>
            <button
              className="event-row__delete"
              type="button"
              aria-label={`${event.title}を削除`}
              onClick={() => onDeleteEvent(event.id)}
            >
              削除
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}
