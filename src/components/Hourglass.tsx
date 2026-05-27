import { useId } from 'react';
import type { CSSProperties } from 'react';
import type { HourglassSegment } from '../features/schedule/scheduleTypes';

type HourglassProps = {
  segments?: HourglassSegment[];
  progressPercent: number;
  showSegments?: boolean;
};

type HourglassStyle = CSSProperties & {
  '--hourglass-current-sand': string;
};

export function Hourglass({ segments = [], progressPercent, showSegments = false }: HourglassProps) {
  const reactId = useId();
  const clipId = `hourglass-${reactId.replace(/:/g, '')}`;
  const safeProgress = Math.min(100, Math.max(0, progressPercent));
  const topBottomY = 142;
  const topMaxHeight = 88;
  const topHeight = Math.max(3, topMaxHeight * ((100 - safeProgress) / 100));
  const topY = topBottomY - topHeight;
  const bottomBaseY = 252;
  const bottomMaxHeight = 88;
  const bottomHeight = Math.max(4, bottomMaxHeight * (safeProgress / 100));
  const bottomTopY = bottomBaseY - bottomHeight;
  const visibleSegments =
    segments.length > 0
      ? segments
      : [{ id: 'remaining-session', label: 'Remaining session', color: '#6f98f7', percent: 100 }];
  const segmentTotal = visibleSegments.reduce((total, segment) => total + Math.max(segment.percent, 0), 0) || 100;
  let segmentOffset = topY;
  const currentSandColor = visibleSegments[0]?.color ?? '#8e65ee';

  return (
    <div
      className="hourglass"
      style={{ '--hourglass-current-sand': currentSandColor } as HourglassStyle}
      aria-label="Dayglass hourglass"
    >
      <svg viewBox="0 0 220 300" role="img">
        <title>Session hourglass</title>
        <defs>
          <linearGradient id={`${clipId}-glass`} x1="42" x2="178" y1="24" y2="270" gradientUnits="userSpaceOnUse">
            <stop stopColor="#ffffff" stopOpacity="0.84" />
            <stop offset="0.48" stopColor="#eaf7ff" stopOpacity="0.26" />
            <stop offset="1" stopColor="#d8f1ff" stopOpacity="0.52" />
          </linearGradient>
          <linearGradient id={`${clipId}-settled`} x1="56" x2="164" y1="176" y2="252" gradientUnits="userSpaceOnUse">
            <stop stopColor="#8d73ef" />
            <stop offset="0.48" stopColor="#f26a91" />
            <stop offset="1" stopColor="#f3ad4f" />
          </linearGradient>
          <radialGradient id={`${clipId}-sand-glow`} cx="50%" cy="50%" r="60%">
            <stop stopColor="#ffffff" stopOpacity="0.42" />
            <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
          <clipPath id={`${clipId}-top-sand`}>
            <path d="M49 52 C52 91 85 117 101 139 C105 145 115 145 119 139 C135 117 168 91 171 52 Z" />
          </clipPath>
          <clipPath id={`${clipId}-bottom-sand`}>
            <path d="M101 161 C85 183 52 209 49 248 C62 267 158 267 171 248 C168 209 135 183 119 161 C115 155 105 155 101 161 Z" />
          </clipPath>
        </defs>

        <path
          className="hourglass__glass-fill"
          fill={`url(#${clipId}-glass)`}
          d="M49 48 C49 91 84 117 101 139 C105 145 115 145 119 139 C136 117 171 91 171 48 C164 33 56 33 49 48 Z"
        />
        <path
          className="hourglass__glass-fill"
          fill={`url(#${clipId}-glass)`}
          d="M101 161 C84 183 49 209 49 252 C56 267 164 267 171 252 C171 209 136 183 119 161 C115 155 105 155 101 161 Z"
        />

        <g clipPath={`url(#${clipId}-top-sand)`}>
          {visibleSegments.map((segment) => {
            const height = topHeight * (Math.max(segment.percent, 0) / segmentTotal);
            const y = segmentOffset;
            segmentOffset += height;

            return (
              <rect
                key={segment.id}
                className="hourglass__sand-layer"
                x="45"
                y={y}
                width="130"
                height={Math.max(height, 1)}
                fill={segment.color}
              >
                <title>{`${segment.label}: ${Math.round(segment.percent)}%`}</title>
              </rect>
            );
          })}
          <rect className="hourglass__sand-sheen" x="45" y={topY} width="130" height={topHeight} fill={`url(#${clipId}-sand-glow)`} />
          <ellipse className="hourglass__sand-surface" cx="110" cy={topY} rx="62" ry="5" />
        </g>

        <g className="hourglass__falling-sand" aria-hidden="true">
          <line className="hourglass__sand-thread" x1="110" y1="142" x2="110" y2="194" />
          <circle className="hourglass__grain hourglass__grain--one" cx="110" cy="150" r="2.9" />
          <circle className="hourglass__grain hourglass__grain--two" cx="110" cy="168" r="2.4" />
          <circle className="hourglass__grain hourglass__grain--three" cx="110" cy="187" r="2.1" />
        </g>

        <g clipPath={`url(#${clipId}-bottom-sand)`}>
          <path
            className="hourglass__settled-sand"
            fill={`url(#${clipId}-settled)`}
            d={`M51 ${bottomBaseY} C74 ${bottomTopY} 146 ${bottomTopY} 169 ${bottomBaseY} L169 266 L51 266 Z`}
          />
          <ellipse className="hourglass__settled-glow" cx="110" cy={bottomTopY + 8} rx="58" ry="24" fill={`url(#${clipId}-sand-glow)`} />
          <ellipse className="hourglass__sand-surface hourglass__sand-surface--bottom" cx="110" cy={bottomTopY} rx="55" ry="5" />
        </g>

        <path
          className="hourglass__glass-highlight hourglass__glass-highlight--top"
          d="M69 56 C55 69 57 83 56 91"
        />
        <path
          className="hourglass__glass-highlight hourglass__glass-highlight--bottom"
          d="M68 200 C57 215 56 229 56 237"
        />
        <path className="hourglass__frame" d="M49 48 C49 91 84 117 101 139 C105 145 115 145 119 139 C136 117 171 91 171 48 C164 33 56 33 49 48 Z" />
        <path className="hourglass__frame" d="M101 161 C84 183 49 209 49 252 C56 267 164 267 171 252 C171 209 136 183 119 161 C115 155 105 155 101 161 Z" />
        <path className="hourglass__rim" d="M62 38 H158" />
        <path className="hourglass__rim" d="M62 262 H158" />
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
