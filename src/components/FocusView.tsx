import { demoNowTime } from '../features/schedule/defaultSession';
import {
  buildHourglassSegments,
  getCurrentEvent,
  getElapsedPercent,
  getNextEvent,
  getRemainingMinutes,
  getSessionStatus,
  minutesToDurationLabel,
} from '../features/schedule/scheduleUtils';
import type { DayglassSession } from '../features/schedule/scheduleTypes';
import { Hourglass } from './Hourglass';
import { NextPoint } from './NextPoint';

type FocusViewProps = {
  session: DayglassSession;
};

export function FocusView({ session }: FocusViewProps) {
  const remainingMinutes = getRemainingMinutes(session, demoNowTime);
  const status = getSessionStatus(session, demoNowTime);
  const currentEvent = getCurrentEvent(session.events, demoNowTime);
  const nextEvent = getNextEvent(session.events, demoNowTime);
  const progressPercent = getElapsedPercent(session, demoNowTime);
  const hourglassSegments = buildHourglassSegments(session, demoNowTime);

  return (
    <main className="focus-view">
      <section className="focus-view__hero">
        <div className="focus-view__status">
          <span>{status}</span>
          <strong>{session.title}</strong>
        </div>

        <Hourglass segments={hourglassSegments} progressPercent={progressPercent} />

        <div className="focus-view__time">
          <span>Remaining</span>
          <strong>{minutesToDurationLabel(remainingMinutes)}</strong>
          <p>Demo time {demoNowTime}</p>
        </div>
      </section>

      <div className="focus-view__footer">
        <section className="current-block">
          <span>Now</span>
          <strong>{currentEvent?.title ?? 'Between events'}</strong>
          <p>{currentEvent ? `${currentEvent.startTime} - ${currentEvent.endTime}` : 'Keep the session moving.'}</p>
        </section>
        <NextPoint nextEvent={nextEvent} nowTime={demoNowTime} sessionEndTime={session.endTime} />
      </div>
    </main>
  );
}
