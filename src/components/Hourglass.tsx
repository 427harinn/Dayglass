import type { HourglassSegment } from '../features/schedule/scheduleTypes';

type HourglassProps = {
  segments?: HourglassSegment[];
  progressPercent: number;
  showSegments?: boolean;
};

export function Hourglass({ segments = [], progressPercent, showSegments = false }: HourglassProps) {
  const topHeight = Math.max(4, 88 - progressPercent * 0.72);
  const bottomHeight = Math.min(82, progressPercent * 0.72);

  return (
    <div className="hourglass" aria-label="Dayglass hourglass placeholder">
      <svg viewBox="0 0 180 260" role="img">
        <title>Session hourglass</title>
        <path className="hourglass__frame" d="M42 14h96M42 246h96M54 24c0 58 34 76 36 106-2 30-36 48-36 106M126 24c0 58-34 76-36 106 2 30 36 48 36 106" />
        <clipPath id="top-sand">
          <path d={`M58 ${32 + (88 - topHeight)} L122 ${32 + (88 - topHeight)} L91 126 Z`} />
        </clipPath>
        <clipPath id="bottom-sand">
          <path d={`M91 134 L124 ${220 - bottomHeight} L56 ${220 - bottomHeight} Z`} />
        </clipPath>
        <rect className="hourglass__sand" x="54" y="30" width="72" height="96" clipPath="url(#top-sand)" />
        <rect className="hourglass__sand hourglass__sand--settled" x="54" y="132" width="72" height="92" clipPath="url(#bottom-sand)" />
        <line className="hourglass__stream" x1="90" y1="126" x2="90" y2="171" />
      </svg>

      {showSegments ? (
        <div className="hourglass__segments" aria-label="Remaining event color segments">
          {segments.map((segment) => (
            <span
              key={segment.id}
              style={{
                backgroundColor: segment.color,
                flexGrow: Math.max(segment.percent, 1),
              }}
              title={`${segment.label}: ${Math.round(segment.percent)}%`}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
