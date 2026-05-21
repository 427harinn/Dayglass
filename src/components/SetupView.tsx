import { useState } from 'react';
import { demoNowTime } from '../features/schedule/defaultSession';
import {
  buildTimelineSegments,
  getElapsedPercent,
  getSessionDuration,
  getSessionTimeRangeError,
  minutesToDurationLabel,
  sortEventsByStartTime,
} from '../features/schedule/scheduleUtils';
import type { DayglassEvent, DayglassSession } from '../features/schedule/scheduleTypes';
import { EventForm } from './EventForm';
import { EventList } from './EventList';
import { Timeline } from './Timeline';

type SetupViewProps = {
  session: DayglassSession;
  onSessionChange: (session: DayglassSession) => void;
};

export function SetupView({ session, onSessionChange }: SetupViewProps) {
  const [editingEvent, setEditingEvent] = useState<DayglassEvent>();
  const timeRangeError = getSessionTimeRangeError(session);
  const timelineSegments = buildTimelineSegments(session);
  const elapsedPercent = getElapsedPercent(session, demoNowTime);
  const duration = getSessionDuration(session);
  const sortedEvents = sortEventsByStartTime(session.events);

  const handleDeleteEvent = (eventId: string) => {
    onSessionChange({
      ...session,
      events: session.events.filter((event) => event.id !== eventId),
    });

    if (editingEvent?.id === eventId) {
      setEditingEvent(undefined);
    }
  };

  return (
    <main className="setup-view">
      <section className="setup-panel setup-panel--form">
        <div className="section-heading">
          <span>設定</span>
          <h2>セッション設定</h2>
        </div>
        <EventForm
          session={session}
          editingEvent={editingEvent}
          timeRangeError={timeRangeError}
          onSessionChange={onSessionChange}
          onEditComplete={() => setEditingEvent(undefined)}
        />
      </section>

      <section className="setup-panel setup-panel--events">
        <div className="section-heading">
          <span>{duration > 0 ? minutesToDurationLabel(duration) : '時間範囲を確認'}</span>
          <h2>イベント一覧</h2>
        </div>
        <Timeline segments={timelineSegments} elapsedPercent={elapsedPercent} />
        <EventList
          events={sortedEvents}
          editingEventId={editingEvent?.id}
          onEditEvent={setEditingEvent}
          onDeleteEvent={handleDeleteEvent}
        />
      </section>
    </main>
  );
}
