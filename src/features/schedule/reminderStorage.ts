import type { ReminderId } from './scheduleTypes';

const REMINDER_STORAGE_KEY = 'dayglass.dismissedReminders.v1';

const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((item) => typeof item === 'string');

export const loadDismissedReminderIds = (): Set<ReminderId> => {
  try {
    const storedValue = window.localStorage.getItem(REMINDER_STORAGE_KEY);

    if (!storedValue) {
      return new Set();
    }

    const parsedValue: unknown = JSON.parse(storedValue);

    if (!isStringArray(parsedValue)) {
      return new Set();
    }

    return new Set(parsedValue as ReminderId[]);
  } catch {
    return new Set();
  }
};

export const saveDismissedReminderIds = (reminderIds: Set<ReminderId>) => {
  try {
    window.localStorage.setItem(REMINDER_STORAGE_KEY, JSON.stringify([...reminderIds]));
  } catch {
    // Keep runtime behavior even when browser storage is unavailable.
  }
};

