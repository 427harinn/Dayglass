import { demoNowTime } from '../features/schedule/defaultSession';
import {
  buildTimelineSegments,
  getElapsedPercent,
  getSessionDuration,
  getSessionTimeRangeError,
  minutesToDurationLabel,
} from '../features/schedule/scheduleUtils';
import type { DayglassSession } from '../features/schedule/scheduleTypes';
import { EventForm } from './EventForm';
import { EventList } from './EventList';
import { Timeline } from './Timeline';

type SetupViewProps = {
  session: DayglassSession;
  onSessionChange: (session: DayglassSession) => void;
};

export function SetupView({ session, onSessionChange }: SetupViewProps) {
  const timeRangeError = getSessionTimeRangeError(session);
  const timelineSegments = buildTimelineSegments(session);
  const elapsedPercent = getElapsedPercent(session, demoNowTime);
  const duration = getSessionDuration(session);

  return (
    <main className="setup-view">
      <section className="setup-panel setup-panel--form">
        <div className="section-heading">
          <span>設定</span>
          <h2>セッション設定</h2>
        </div>
        <EventForm
          session={session}
          timeRangeError={timeRangeError}
          onSessionChange={onSessionChange}
        />
      </section>

      <section className="setup-panel setup-panel--events">
        <div className="section-heading">
          <span>{duration > 0 ? minutesToDurationLabel(duration) : '時間範囲を確認'}</span>
          <h2>イベント一覧</h2>
        </div>
        <Timeline segments={timelineSegments} elapsedPercent={elapsedPercent} />
        <EventList events={session.events} />
      </section>
    </main>
  );
}
