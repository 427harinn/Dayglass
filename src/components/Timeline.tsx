import type { TimelineSegment } from '../features/schedule/scheduleTypes';

type TimelineProps = {
  segments: TimelineSegment[];
  elapsedPercent: number;
};

export function Timeline({ segments, elapsedPercent }: TimelineProps) {
  return (
    <div className="timeline" aria-label="Session timeline preview">
      <div className="timeline__track">
        {segments.map((segment) => (
          <span
            className="timeline__segment"
            key={segment.id}
            style={{
              backgroundColor: segment.color,
              left: `${segment.startPercent}%`,
              width: `${segment.widthPercent}%`,
            }}
            title={`${segment.title}: ${segment.startTime}-${segment.endTime}`}
          />
        ))}
        <span
          className="timeline__now"
          style={{ left: `${elapsedPercent}%` }}
          aria-label="Current demo time"
        />
      </div>
    </div>
  );
}
