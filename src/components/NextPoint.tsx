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
        <span>Next point</span>
        <strong>Session ends at {sessionEndTime}</strong>
        <p>{minutesToDurationLabel(timeToMinutes(sessionEndTime) - timeToMinutes(nowTime))} remaining</p>
      </section>
    );
  }

  return (
    <section className="next-point">
      <span>Next point</span>
      <strong>{nextEvent.title}</strong>
      <p>
        Starts at {nextEvent.startTime} /{' '}
        {minutesToDurationLabel(timeToMinutes(nextEvent.startTime) - timeToMinutes(nowTime))}
      </p>
    </section>
  );
}
