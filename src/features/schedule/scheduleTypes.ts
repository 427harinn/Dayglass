export type EventType =
  | 'work'
  | 'meeting'
  | 'break'
  | 'goal'
  | 'wrapup'
  | 'free';

export type DayglassEvent = {
  id: string;
  title: string;
  type: EventType;
  startTime: string;
  endTime?: string;
  color?: string;
  memo?: string;
};

export type DayglassSession = {
  id: string;
  date: string;
  title: string;
  startTime: string;
  endTime: string;
  events: DayglassEvent[];
};

export type AppMode = 'setup' | 'focus';

export type SessionStatus = 'beforeStart' | 'active' | 'finished';

export type TimelineSegment = {
  id: string;
  title: string;
  type: EventType;
  color: string;
  startPercent: number;
  widthPercent: number;
  startTime: string;
  endTime: string;
};

export type HourglassSegment = {
  id: string;
  label: string;
  color: string;
  percent: number;
};
