import { eventTypeColors } from './defaultSession';
import type {
  DayglassEvent,
  DayglassSession,
  HourglassSegment,
  SessionStatus,
  TimelineSegment,
} from './scheduleTypes';

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

export const timeToMinutes = (time: string) => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

export const minutesToDurationLabel = (minutes: number) => {
  const safeMinutes = Math.max(0, Math.round(minutes));
  const hours = Math.floor(safeMinutes / 60);
  const remainingMinutes = safeMinutes % 60;

  if (hours === 0) {
    return `${remainingMinutes}m`;
  }

  if (remainingMinutes === 0) {
    return `${hours}h`;
  }

  return `${hours}h ${remainingMinutes}m`;
};

export const getSessionDuration = (session: DayglassSession) =>
  timeToMinutes(session.endTime) - timeToMinutes(session.startTime);

export const getSessionStatus = (
  session: DayglassSession,
  nowTime: string,
): SessionStatus => {
  const now = timeToMinutes(nowTime);
  const start = timeToMinutes(session.startTime);
  const end = timeToMinutes(session.endTime);

  if (now < start) {
    return 'beforeStart';
  }

  if (now >= end) {
    return 'finished';
  }

  return 'active';
};

export const getRemainingMinutes = (
  session: DayglassSession,
  nowTime: string,
) => clamp(timeToMinutes(session.endTime) - timeToMinutes(nowTime), 0, getSessionDuration(session));

export const getElapsedPercent = (
  session: DayglassSession,
  nowTime: string,
) => {
  const elapsed = timeToMinutes(nowTime) - timeToMinutes(session.startTime);
  return clamp((elapsed / getSessionDuration(session)) * 100, 0, 100);
};

export const getNextEvent = (
  events: DayglassEvent[],
  nowTime: string,
) => {
  const now = timeToMinutes(nowTime);

  return events
    .filter((event) => timeToMinutes(event.startTime) >= now)
    .sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime))[0];
};

export const getCurrentEvent = (
  events: DayglassEvent[],
  nowTime: string,
) => {
  const now = timeToMinutes(nowTime);

  return events.find((event) => {
    if (!event.endTime) {
      return false;
    }

    return timeToMinutes(event.startTime) <= now && now < timeToMinutes(event.endTime);
  });
};

export const getEventColor = (event: DayglassEvent) =>
  event.color ?? eventTypeColors[event.type];

export const buildTimelineSegments = (
  session: DayglassSession,
): TimelineSegment[] => {
  const sessionStart = timeToMinutes(session.startTime);
  const duration = getSessionDuration(session);

  return session.events
    .filter((event) => event.endTime)
    .map((event) => {
      const eventStart = timeToMinutes(event.startTime);
      const eventEnd = timeToMinutes(event.endTime!);

      return {
        id: event.id,
        title: event.title,
        type: event.type,
        color: getEventColor(event),
        startPercent: clamp(((eventStart - sessionStart) / duration) * 100, 0, 100),
        widthPercent: clamp(((eventEnd - eventStart) / duration) * 100, 0, 100),
        startTime: event.startTime,
        endTime: event.endTime!,
      };
    });
};

export const buildHourglassSegments = (
  session: DayglassSession,
  nowTime: string,
): HourglassSegment[] => {
  const now = timeToMinutes(nowTime);
  const sessionEnd = timeToMinutes(session.endTime);
  const remainingEvents = session.events.filter((event) => {
    if (!event.endTime) {
      return false;
    }

    return timeToMinutes(event.endTime) > now;
  });
  const remainingSessionMinutes = Math.max(0, sessionEnd - now);

  if (remainingSessionMinutes === 0) {
    return [];
  }

  return remainingEvents.map((event) => {
    const start = Math.max(timeToMinutes(event.startTime), now);
    const end = Math.min(timeToMinutes(event.endTime!), sessionEnd);
    const percent = clamp(((end - start) / remainingSessionMinutes) * 100, 0, 100);

    return {
      id: event.id,
      label: event.title,
      color: getEventColor(event),
      percent,
    };
  });
};
