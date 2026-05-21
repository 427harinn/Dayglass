import type { ChangeEvent, FormEvent } from 'react';
import { useState } from 'react';
import { eventTypeLabels } from '../features/schedule/defaultSession';
import {
  getEventTimeRangeError,
  sortEventsByStartTime,
} from '../features/schedule/scheduleUtils';
import type { DayglassEvent, DayglassSession, EventType } from '../features/schedule/scheduleTypes';

type EventFormProps = {
  session: DayglassSession;
  timeRangeError?: string;
  onSessionChange: (session: DayglassSession) => void;
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

export function EventForm({ session, timeRangeError, onSessionChange }: EventFormProps) {
  const [eventDraft, setEventDraft] = useState<EventDraft>(initialEventDraft);
  const [eventError, setEventError] = useState<string>();

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

  const handleAddEvent = (event: FormEvent<HTMLFormElement>) => {
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
      id: createEventId(),
      title,
      type: eventDraft.type,
      startTime: eventDraft.startTime,
      endTime: eventDraft.endTime,
      memo: memo || undefined,
    };

    onSessionChange({
      ...session,
      events: sortEventsByStartTime([...session.events, nextEvent]),
    });
    setEventDraft(initialEventDraft);
    setEventError(undefined);
  };

  return (
    <form className="form-shell" onSubmit={handleAddEvent}>
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

      <button className="secondary-button" type="submit">
        イベントを追加
      </button>
    </form>
  );
}
