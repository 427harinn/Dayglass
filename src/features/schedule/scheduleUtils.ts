import { eventTypeColors } from './defaultSession';
import type {
  DayglassEvent,
  DayglassSession,
  HourglassSegment,
  ReminderId,
  ReminderNotice,
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

export const sortEventsByStartTime = (events: DayglassEvent[]) =>
  [...events].sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime));

export const getSessionDuration = (session: DayglassSession) =>
  timeToMinutes(session.endTime) - timeToMinutes(session.startTime);

export const isSessionTimeRangeValid = (session: DayglassSession) =>
  getSessionDuration(session) > 0;

export const getSessionTimeRangeError = (session: DayglassSession) => {
  if (isSessionTimeRangeValid(session)) {
    return undefined;
  }

  return '終了時刻は開始時刻より後にしてください。';
};

export const isTimeRangeValid = (startTime: string, endTime: string) =>
  timeToMinutes(endTime) > timeToMinutes(startTime);

export const isTimeRangeWithinSession = (
  session: DayglassSession,
  startTime: string,
  endTime: string,
) => {
  const sessionStart = timeToMinutes(session.startTime);
  const sessionEnd = timeToMinutes(session.endTime);
  const start = timeToMinutes(startTime);
  const end = timeToMinutes(endTime);

  return start >= sessionStart && end <= sessionEnd;
};

export const getEventTimeRangeError = (
  session: DayglassSession,
  startTime: string,
  endTime: string,
) => {
  if (!isTimeRangeValid(startTime, endTime)) {
    return 'イベントの終了時刻は開始時刻より後にしてください。';
  }

  if (!isSessionTimeRangeValid(session)) {
    return '先にセッションの時間範囲を確認してください。';
  }

  if (!isTimeRangeWithinSession(session, startTime, endTime)) {
    return 'イベントはセッションの時間範囲内にしてください。';
  }

  return undefined;
};

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
) => {
  const duration = Math.max(0, getSessionDuration(session));
  return clamp(timeToMinutes(session.endTime) - timeToMinutes(nowTime), 0, duration);
};

export const getElapsedPercent = (
  session: DayglassSession,
  nowTime: string,
) => {
  const duration = getSessionDuration(session);

  if (duration <= 0) {
    return 0;
  }

  const elapsed = timeToMinutes(nowTime) - timeToMinutes(session.startTime);
  return clamp((elapsed / duration) * 100, 0, 100);
};

export const getNextEvent = (
  events: DayglassEvent[],
  nowTime: string,
) => {
  const now = timeToMinutes(nowTime);

  return sortEventsByStartTime(events).find((event) => timeToMinutes(event.startTime) >= now);
};

export const getCurrentEvent = (
  events: DayglassEvent[],
  nowTime: string,
) => {
  const now = timeToMinutes(nowTime);

  return sortEventsByStartTime(events).find((event) => {
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

  if (duration <= 0) {
    return [];
  }

  return sortEventsByStartTime(session.events)
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
  const remainingEvents = sortEventsByStartTime(session.events).filter((event) => {
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

const toTimeLabel = (timeInMinutes: number) => {
  const hours = Math.floor(timeInMinutes / 60)
    .toString()
    .padStart(2, '0');
  const minutes = (timeInMinutes % 60).toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};

export const getInAppReminderNotices = (
  session: DayglassSession,
  currentTime: string,
  displayedReminderIds: Set<ReminderId>,
  dismissedReminderIds: Set<ReminderId>,
): ReminderNotice[] => {
  const now = timeToMinutes(currentTime);
  const reminders: ReminderNotice[] = [];
  const sessionEnd = timeToMinutes(session.endTime);
  const sessionReminderTrigger = sessionEnd - 20;
  const sessionReminderId: ReminderId = `sessionEndSoon:${session.id}`;

  if (
    sessionReminderTrigger >= timeToMinutes(session.startTime) &&
    now >= sessionReminderTrigger &&
    now < sessionEnd &&
    !displayedReminderIds.has(sessionReminderId) &&
    !dismissedReminderIds.has(sessionReminderId)
  ) {
    reminders.push({
      id: sessionReminderId,
      type: 'sessionEndSoon',
      title: 'セッション終了が近づいています',
      message: `${session.endTime} の20分前です。`,
      triggerAt: toTimeLabel(sessionReminderTrigger),
      targetTime: session.endTime,
    });
  }

  sortEventsByStartTime(session.events).forEach((event) => {
    const eventStart = timeToMinutes(event.startTime);
    const triggerTime = eventStart - 10;
    const reminderId: ReminderId = `eventStartSoon:${session.id}:${event.id}`;

    if (
      triggerTime >= timeToMinutes(session.startTime) &&
      now >= triggerTime &&
      now < eventStart &&
      !displayedReminderIds.has(reminderId) &&
      !dismissedReminderIds.has(reminderId)
    ) {
      reminders.push({
        id: reminderId,
        type: 'eventStartSoon',
        title: 'イベント開始が近づいています',
        message: `${event.startTime} から「${event.title}」が始まります。`,
        triggerAt: toTimeLabel(triggerTime),
        targetTime: event.startTime,
      });
    }
  });

  return reminders;
};
