import { useEffect, useState } from 'react';
import {
  getCurrentEvent,
  getElapsedPercent,
  getInAppReminderNotices,
  getNextEvent,
  getRemainingMinutes,
  getSessionStatus,
  minutesToDurationLabel,
  sortEventsByStartTime,
  timeToMinutes,
} from '../features/schedule/scheduleUtils';
import type { DayglassSession, ReminderId, ReminderNotice } from '../features/schedule/scheduleTypes';
import { Hourglass } from './Hourglass';

type FocusViewProps = {
  session: DayglassSession;
  currentTime: string;
};

const statusLabels = {
  beforeStart: '開始前',
  active: '進行中',
  finished: '終了',
};

export function FocusView({ session, currentTime }: FocusViewProps) {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [displayedReminderIds, setDisplayedReminderIds] = useState<Set<ReminderId>>(new Set());
  const [activeReminders, setActiveReminders] = useState<ReminderNotice[]>([]);
  const remainingMinutes = getRemainingMinutes(session, currentTime);
  const status = getSessionStatus(session, currentTime);
  const currentEvent = getCurrentEvent(session.events, currentTime);
  const nextEvent = getNextEvent(session.events, currentTime);
  const progressPercent = getElapsedPercent(session, currentTime);
  const upcomingEvents = sortEventsByStartTime(session.events).filter((event) => {
    if (!event.endTime) {
      return timeToMinutes(event.startTime) >= timeToMinutes(currentTime);
    }

    return timeToMinutes(event.endTime) > timeToMinutes(currentTime);
  });
  const nextPointLabel = nextEvent
    ? `${nextEvent.startTime} ${nextEvent.title}`
    : `${session.endTime} セッション終了`;

  useEffect(() => {
    const nextReminders = getInAppReminderNotices(session, currentTime, displayedReminderIds);

    if (nextReminders.length === 0) {
      return;
    }

    setDisplayedReminderIds((current) => {
      const next = new Set(current);
      nextReminders.forEach((reminder) => next.add(reminder.id));
      return next;
    });
    setActiveReminders((current) => [...current, ...nextReminders]);
  }, [currentTime, displayedReminderIds, session]);

  const dismissReminder = (reminderId: ReminderId) => {
    setActiveReminders((current) => current.filter((reminder) => reminder.id !== reminderId));
  };

  return (
    <main className="focus-view">
      {activeReminders.length > 0 ? (
        <section className="focus-reminders" aria-label="In-app reminders">
          {activeReminders.map((reminder) => (
            <article key={reminder.id} className="focus-reminder-card">
              <div>
                <p>{reminder.title}</p>
                <small>{reminder.message}</small>
              </div>
              <button type="button" onClick={() => dismissReminder(reminder.id)} aria-label="reminder close">
                閉じる
              </button>
            </article>
          ))}
        </section>
      ) : null}
      <section className="focus-view__hero">
        <div className="focus-view__time">
          <span>残り時間</span>
          <strong>{minutesToDurationLabel(remainingMinutes)}</strong>
        </div>

        <Hourglass progressPercent={progressPercent} />

        <div className="focus-view__summary">
          <p className="focus-view__demo-time">現在時刻 {currentTime}</p>
          <p className="focus-view__status">
            <span>{statusLabels[status]}</span>
            <strong>{session.title}</strong>
          </p>
          <p className="focus-view__next-point">
            <span>次のポイント</span>
            <strong>{nextPointLabel}</strong>
          </p>
          <button
            className="focus-view__details-button"
            type="button"
            aria-expanded={isDetailsOpen}
            onClick={() => setIsDetailsOpen((current) => !current)}
          >
            {isDetailsOpen ? '詳細を閉じる' : '詳細を表示'}
          </button>
        </div>
      </section>

      {isDetailsOpen ? (
        <section className="focus-details" aria-label="Focus details">
          <div className="focus-details__header">
            <div>
              <span>Focus Details</span>
              <h2>詳細</h2>
            </div>
            <button className="ghost-button" type="button" onClick={() => setIsDetailsOpen(false)}>
              閉じる
            </button>
          </div>

          <div className="focus-details__grid">
            <section className="current-block">
              <span>現在の予定</span>
              <strong>{currentEvent?.title ?? '予定の合間'}</strong>
              <p>
                {currentEvent
                  ? `${currentEvent.startTime} - ${currentEvent.endTime}`
                  : 'セッションを続けています。'}
              </p>
            </section>

            <section className="current-block">
              <span>次の予定</span>
              <strong>{nextEvent?.title ?? 'セッション終了'}</strong>
              <p>{nextEvent ? `${nextEvent.startTime} 開始` : `${session.endTime} 終了`}</p>
            </section>
          </div>

          <section className="focus-details__timeline" aria-label="Upcoming events">
            <span>今後の予定</span>
            <ol>
              {upcomingEvents.map((event) => (
                <li key={event.id}>
                  <time>{event.startTime}</time>
                  <strong>{event.title}</strong>
                  <small>{event.endTime ?? '終了未設定'}</small>
                </li>
              ))}
              {upcomingEvents.length === 0 ? (
                <li>
                  <time>{session.endTime}</time>
                  <strong>セッション終了</strong>
                  <small>残りの予定はありません</small>
                </li>
              ) : null}
            </ol>
          </section>
        </section>
      ) : null}
    </main>
  );
}
