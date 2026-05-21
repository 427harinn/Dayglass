import { defaultSession } from './defaultSession';
import type { DayglassEvent, DayglassSession, EventType } from './scheduleTypes';

const STORAGE_KEY = 'dayglass.session.v1';

const eventTypes: EventType[] = ['work', 'meeting', 'break', 'goal', 'wrapup', 'free'];

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const isString = (value: unknown): value is string => typeof value === 'string';

const isEventType = (value: unknown): value is EventType =>
  isString(value) && eventTypes.includes(value as EventType);

const isDayglassEvent = (value: unknown): value is DayglassEvent => {
  if (!isObject(value)) {
    return false;
  }

  return (
    isString(value.id) &&
    isString(value.title) &&
    isEventType(value.type) &&
    isString(value.startTime) &&
    (value.endTime === undefined || isString(value.endTime)) &&
    (value.color === undefined || isString(value.color)) &&
    (value.memo === undefined || isString(value.memo))
  );
};

export const isDayglassSession = (value: unknown): value is DayglassSession => {
  if (!isObject(value)) {
    return false;
  }

  return (
    isString(value.id) &&
    isString(value.date) &&
    isString(value.title) &&
    isString(value.startTime) &&
    isString(value.endTime) &&
    Array.isArray(value.events) &&
    value.events.every(isDayglassEvent)
  );
};

export const loadSession = (): DayglassSession => {
  try {
    const storedValue = window.localStorage.getItem(STORAGE_KEY);

    if (!storedValue) {
      return defaultSession;
    }

    const parsedValue: unknown = JSON.parse(storedValue);

    return isDayglassSession(parsedValue) ? parsedValue : defaultSession;
  } catch {
    return defaultSession;
  }
};

export const saveSession = (session: DayglassSession) => {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } catch {
    // The app can keep running with in-memory state if browser storage is unavailable.
  }
};
