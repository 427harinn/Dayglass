import type { DayglassSession, EventType } from './scheduleTypes';

export const eventTypeLabels: Record<EventType, string> = {
  work: 'Work',
  meeting: 'Meeting',
  break: 'Break',
  goal: 'Goal',
  wrapup: 'Wrap-up',
  free: 'Free',
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
  title: 'Product Design Sprint',
  startTime: '09:30',
  endTime: '18:00',
  events: [
    {
      id: 'event-1',
      title: 'Deep work block',
      type: 'work',
      startTime: '09:30',
      endTime: '11:30',
      memo: 'Morning implementation focus.',
    },
    {
      id: 'event-2',
      title: 'Roadmap sync',
      type: 'meeting',
      startTime: '11:30',
      endTime: '12:10',
    },
    {
      id: 'event-3',
      title: 'Lunch break',
      type: 'break',
      startTime: '12:10',
      endTime: '13:00',
    },
    {
      id: 'event-4',
      title: 'Prototype hour',
      type: 'goal',
      startTime: '13:00',
      endTime: '16:30',
      memo: 'Make the timer view feel calm and readable.',
    },
    {
      id: 'event-5',
      title: 'Daily wrap',
      type: 'wrapup',
      startTime: '17:20',
      endTime: '18:00',
    },
  ],
};
