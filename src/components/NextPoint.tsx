import { minutesToDurationLabel, timeToMinutes } from '../features/schedule/scheduleUtils';
import type { DayglassEvent } from '../features/schedule/scheduleTypes';

type NextPointProps = {
  nextEvent?: DayglassEvent;
  nowTime: string;
  sessionEndTime: string;
};

export function NextPoint({ nextEvent, nowTime, sessionEndTime }: NextPointProps) {
  if (!nextEvent) {
    return (
      <section className="next-point">
        <span>次のポイント</span>
        <strong>セッション終了 {sessionEndTime}</strong>
        <p>残り {minutesToDurationLabel(timeToMinutes(sessionEndTime) - timeToMinutes(nowTime))}</p>
      </section>
    );
  }

  return (
    <section className="next-point">
      <span>次のポイント</span>
      <strong>{nextEvent.title}</strong>
      <p>
        {nextEvent.startTime} 開始 / あと{' '}
        {minutesToDurationLabel(timeToMinutes(nextEvent.startTime) - timeToMinutes(nowTime))}
      </p>
    </section>
  );
}
