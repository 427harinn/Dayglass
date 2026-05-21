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

const statusLabels = {
  beforeStart: '開始前',
  active: '進行中',
  finished: '終了',
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
          <span>{statusLabels[status]}</span>
          <strong>{session.title}</strong>
        </div>

        <Hourglass segments={hourglassSegments} progressPercent={progressPercent} />

        <div className="focus-view__time">
          <span>残り時間</span>
          <strong>{minutesToDurationLabel(remainingMinutes)}</strong>
          <p>デモ時刻 {demoNowTime}</p>
        </div>
      </section>

      <div className="focus-view__footer">
        <section className="current-block">
          <span>現在</span>
          <strong>{currentEvent?.title ?? '予定の合間'}</strong>
          <p>{currentEvent ? `${currentEvent.startTime} - ${currentEvent.endTime}` : 'セッションを続けています。'}</p>
        </section>
        <NextPoint nextEvent={nextEvent} nowTime={demoNowTime} sessionEndTime={session.endTime} />
      </div>
    </main>
  );
}
