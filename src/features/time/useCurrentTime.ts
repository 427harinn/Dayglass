import { useEffect, useState } from 'react';
import { getCurrentTimeLabel } from './timeUtils';

export function useCurrentTime() {
  const [currentTime, setCurrentTime] = useState(getCurrentTimeLabel);

  useEffect(() => {
    const timerId = window.setInterval(() => {
      setCurrentTime(getCurrentTimeLabel());
    }, 60_000);

    return () => window.clearInterval(timerId);
  }, []);

  return currentTime;
}
