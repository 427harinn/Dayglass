import type { ChangeEvent, FormEvent } from 'react';
import { useEffect, useState } from 'react';
import { eventTypeLabels } from '../features/schedule/defaultSession';
import {
  getEventTimeRangeError,
  sortEventsByStartTime,
} from '../features/schedule/scheduleUtils';
import type { DayglassEvent, DayglassSession, EventType } from '../features/schedule/scheduleTypes';

type EventFormProps = {
  session: DayglassSession;
  editingEvent?: DayglassEvent;
  timeRangeError?: string;
  onSessionChange: (session: DayglassSession) => void;
  onEditComplete: () => void;
};

type EventDraft = {
  title: string;
  type: EventType;
  startTime: string;
  endTime: string;
  memo: string;
};

const initialEventDraft: EventDraft = {
  title: '',
  type: 'work',
  startTime: '',
  endTime: '',
  memo: '',
};

const createEventId = () => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }

  return `event-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
};

const eventToDraft = (event: DayglassEvent): EventDraft => ({
  title: event.title,
  type: event.type,
  startTime: event.startTime,
  endTime: event.endTime ?? '',
  memo: event.memo ?? '',
});

// EventForm は session 基本情報の編集と、event の追加/更新を担当する。
export function EventForm({
  session,
  editingEvent,
  timeRangeError,
  onSessionChange,
  onEditComplete,
}: EventFormProps) {
  const [eventDraft, setEventDraft] = useState<EventDraft>(initialEventDraft);
  const [eventError, setEventError] = useState<string>();
  const isEditing = Boolean(editingEvent);

  useEffect(() => {
    if (editingEvent) {
      setEventDraft(eventToDraft(editingEvent));
      setEventError(undefined);
      return;
    }

    setEventDraft(initialEventDraft);
    setEventError(undefined);
  }, [editingEvent]);

  const updateSessionField =
    (field: keyof Pick<DayglassSession, 'title' | 'startTime' | 'endTime'>) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      onSessionChange({
        ...session,
        [field]: event.target.value,
      });
    };

  const updateEventField =
    (field: keyof EventDraft) =>
    (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      setEventDraft((currentDraft) => ({
        ...currentDraft,
        [field]: event.target.value,
      }));
      setEventError(undefined);
    };

  const resetEventForm = () => {
    setEventDraft(initialEventDraft);
    setEventError(undefined);
    onEditComplete();
  };

  const handleSubmitEvent = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const title = eventDraft.title.trim();
    const memo = eventDraft.memo.trim();

    if (!title || !eventDraft.startTime || !eventDraft.endTime) {
      setEventError('イベント名、開始時刻、終了時刻を入力してください。');
      return;
    }

    const timeRangeValidation = getEventTimeRangeError(
      session,
      eventDraft.startTime,
      eventDraft.endTime,
    );

    if (timeRangeValidation) {
      setEventError(timeRangeValidation);
      return;
    }

    const nextEvent: DayglassEvent = {
      id: editingEvent?.id ?? createEventId(),
      title,
      type: eventDraft.type,
      startTime: eventDraft.startTime,
      endTime: eventDraft.endTime,
      memo: memo || undefined,
    };
    const nextEvents = editingEvent
      ? session.events.map((eventItem) =>
          eventItem.id === editingEvent.id ? nextEvent : eventItem,
        )
      : [...session.events, nextEvent];

    onSessionChange({
      ...session,
      events: sortEventsByStartTime(nextEvents),
    });
    resetEventForm();
  };

  return (
    <form className="form-shell" onSubmit={handleSubmitEvent}>
      <div className="form-grid">
        <label>
          セッション名
          <input value={session.title} onChange={updateSessionField('title')} />
        </label>
        <label>
          日付
          <input value={session.date} readOnly />
        </label>
        <label>
          開始
          <input type="time" value={session.startTime} onChange={updateSessionField('startTime')} />
        </label>
        <label>
          終了
          <input type="time" value={session.endTime} onChange={updateSessionField('endTime')} />
        </label>
      </div>

      {timeRangeError ? <p className="form-error">{timeRangeError}</p> : null}

      <div className="event-form-heading">
        <span>{isEditing ? 'イベント編集' : 'イベント追加'}</span>
      </div>

      <div className="event-draft">
        <label>
          イベント名
          <input
            value={eventDraft.title}
            placeholder="新しいイベント"
            onChange={updateEventField('title')}
          />
        </label>
        <label>
          種別
          <select value={eventDraft.type} onChange={updateEventField('type')}>
            {Object.entries(eventTypeLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <label>
          開始
          <input
            type="time"
            value={eventDraft.startTime}
            onChange={updateEventField('startTime')}
          />
        </label>
        <label>
          終了
          <input
            type="time"
            value={eventDraft.endTime}
            onChange={updateEventField('endTime')}
          />
        </label>
        <label className="event-draft__memo">
          メモ
          <textarea
            value={eventDraft.memo}
            placeholder="必要ならメモを残す"
            rows={3}
            onChange={updateEventField('memo')}
          />
        </label>
      </div>

      {eventError ? <p className="form-error">{eventError}</p> : null}

      <div className="form-actions">
        <button className="secondary-button" type="submit">
          {isEditing ? 'イベントを更新' : 'イベントを追加'}
        </button>
        {isEditing ? (
          <button className="ghost-button" type="button" onClick={resetEventForm}>
            編集をキャンセル
          </button>
        ) : null}
      </div>
    </form>
  );
}
