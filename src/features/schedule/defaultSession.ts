import type { DayglassSession, EventType } from './scheduleTypes';

export const eventTypeLabels: Record<EventType, string> = {
  work: '作業',
  meeting: 'ミーティング',
  break: '休憩',
  goal: '目標',
  wrapup: 'まとめ',
  free: '自由時間',
};

export const eventTypeColors: Record<EventType, string> = {
  work: '#5b7cfa',
  meeting: '#21a39a',
  break: '#e6a23c',
  goal: '#a855f7',
  wrapup: '#ef6f6c',
  free: '#8a98a8',
};

export const demoNowTime = '13:20';

export const defaultSession: DayglassSession = {
  id: 'demo-session',
  date: '2026-05-21',
  title: 'プロダクト設計スプリント',
  startTime: '09:30',
  endTime: '18:00',
  events: [
    {
      id: 'event-1',
      title: '集中作業',
      type: 'work',
      startTime: '09:30',
      endTime: '11:30',
      memo: '午前の実装に集中する時間。',
    },
    {
      id: 'event-2',
      title: 'ロードマップ確認',
      type: 'meeting',
      startTime: '11:30',
      endTime: '12:10',
    },
    {
      id: 'event-3',
      title: '昼休憩',
      type: 'break',
      startTime: '12:10',
      endTime: '13:00',
    },
    {
      id: 'event-4',
      title: 'プロトタイプ作成',
      type: 'goal',
      startTime: '13:00',
      endTime: '16:30',
      memo: 'タイマー画面を落ち着いて見やすくする。',
    },
    {
      id: 'event-5',
      title: '一日のまとめ',
      type: 'wrapup',
      startTime: '17:20',
      endTime: '18:00',
    },
  ],
};
