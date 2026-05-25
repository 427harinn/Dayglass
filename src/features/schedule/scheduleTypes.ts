// EventType はフォーム、色、ラベルで共有するイベント種別。
export type EventType =
  | 'work'
  | 'meeting'
  | 'break'
  | 'goal'
  | 'wrapup'
  | 'free';

// DayglassEvent は session 内に置かれる 1 つの予定ブロック。
export type DayglassEvent = {
  id: string;
  title: string;
  type: EventType;
  startTime: string;
  endTime?: string;
  color?: string;
  memo?: string;
};

// DayglassSession は現在の MVP で扱う 1 つの作業時間帯。
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

// TimelineSegment は横長タイムライン表示のために生成される表示用データ。
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

// HourglassSegment は将来の分割砂時計表示に使う表示用データ。
export type HourglassSegment = {
  id: string;
  label: string;
  color: string;
  percent: number;
};
