import { useState } from 'react';
import {
  buildTimelineLayout,
  getSessionDuration,
  getSessionStatusBadgeLabel,
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
  currentTime: string;
  onSessionChange: (session: DayglassSession) => void;
};

export function SetupView({ session, currentTime, onSessionChange }: SetupViewProps) {
  const [editingEvent, setEditingEvent] = useState<DayglassEvent>();
  const timeRangeError = getSessionTimeRangeError(session);
  const timelineLayout = buildTimelineLayout(session, currentTime);
  const duration = getSessionDuration(session);
  const statusBadgeLabel = getSessionStatusBadgeLabel(session, currentTime);
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
        <div className="section-heading section-heading--with-status">
          <div>
            <span>{duration > 0 ? minutesToDurationLabel(duration) : '時間範囲を確認'}</span>
            <h2>イベント一覧</h2>
          </div>
          <span className="session-status-badge">{statusBadgeLabel}</span>
        </div>
        <Timeline layout={timelineLayout} />
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
