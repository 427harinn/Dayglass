import {
  useRef,
  useState,
  type CSSProperties,
  type FocusEvent,
  type PointerEvent,
} from 'react';
import type { TimelineLayout, TimelineSegment } from '../features/schedule/scheduleTypes';

type TimelineProps = {
  layout: TimelineLayout;
};

type ActiveTooltip = {
  segment: TimelineSegment;
  align: TimelineSegment['tooltipAlign'];
  left: number;
};

const getTooltipAlign = (
  left: number,
  containerWidth: number,
): TimelineSegment['tooltipAlign'] => {
  if (left < 132) {
    return 'left';
  }

  if (containerWidth - left < 132) {
    return 'right';
  }

  return 'center';
};

export function Timeline({ layout }: TimelineProps) {
  const timelineRef = useRef<HTMLDivElement>(null);
  const [activeTooltip, setActiveTooltip] = useState<ActiveTooltip>();
  const trackStyle = {
    '--timeline-lanes': layout.laneCount,
  } as CSSProperties;

  const showTooltip = (target: HTMLElement, segment: TimelineSegment) => {
    const timelineRect = timelineRef.current?.getBoundingClientRect();
    const segmentRect = target.getBoundingClientRect();

    if (!timelineRect) {
      return;
    }

    const left = Math.min(
      Math.max(segmentRect.left + segmentRect.width / 2 - timelineRect.left, 12),
      timelineRect.width - 12,
    );

    setActiveTooltip({
      segment,
      align: getTooltipAlign(left, timelineRect.width),
      left,
    });
  };

  const hideTooltip = () => setActiveTooltip(undefined);

  const handleSegmentPointerUp = (
    event: PointerEvent<HTMLButtonElement>,
    segment: TimelineSegment,
  ) => {
    if (event.pointerType === 'mouse') {
      return;
    }

    setActiveTooltip((current) => {
      if (current?.segment.id === segment.id) {
        return undefined;
      }

      const timelineRect = timelineRef.current?.getBoundingClientRect();
      const segmentRect = event.currentTarget.getBoundingClientRect();

      if (!timelineRect) {
        return undefined;
      }

      const left = Math.min(
        Math.max(segmentRect.left + segmentRect.width / 2 - timelineRect.left, 12),
        timelineRect.width - 12,
      );

      return {
        segment,
        align: getTooltipAlign(left, timelineRect.width),
        left,
      };
    });
  };

  const handleSegmentFocus = (
    event: FocusEvent<HTMLButtonElement>,
    segment: TimelineSegment,
  ) => {
    showTooltip(event.currentTarget, segment);
  };

  return (
    <div className="timeline" ref={timelineRef} aria-label="Session timeline preview">
      {activeTooltip ? (
        <div
          className={`timeline__tooltip timeline__tooltip--${activeTooltip.align}`}
          id={`timeline-tooltip-${activeTooltip.segment.id}`}
          role="tooltip"
          style={{ left: activeTooltip.left }}
        >
          <strong>{activeTooltip.segment.title}</strong>
          <span>{activeTooltip.segment.startTime} - {activeTooltip.segment.endTime}</span>
          <span>{activeTooltip.segment.typeLabel}</span>
          {activeTooltip.segment.memo ? <small>{activeTooltip.segment.memo}</small> : null}
        </div>
      ) : null}
      <div className="timeline__viewport" onScroll={hideTooltip}>
        <div className="timeline__stage">
          <div className="timeline__labels" aria-hidden="true">
            <span>{layout.startTime}</span>
            <span>{layout.endTime}</span>
          </div>
          <div className="timeline__track" style={trackStyle}>
            {layout.segments.map((segment) => (
              <button
                aria-label={`${segment.title}: ${segment.startTime}-${segment.endTime}`}
                aria-describedby={
                  activeTooltip?.segment.id === segment.id
                    ? `timeline-tooltip-${segment.id}`
                    : undefined
                }
                aria-expanded={activeTooltip?.segment.id === segment.id}
                className={`timeline__segment timeline__segment--${segment.labelLevel}${
                  activeTooltip?.segment.id === segment.id ? ' is-active' : ''
                }`}
                key={segment.id}
                onBlur={hideTooltip}
                onFocus={(event) => handleSegmentFocus(event, segment)}
                onMouseEnter={(event) => showTooltip(event.currentTarget, segment)}
                onMouseLeave={hideTooltip}
                onPointerUp={(event) => handleSegmentPointerUp(event, segment)}
                style={{
                  backgroundColor: segment.color,
                  left: `${segment.startPercent}%`,
                  top: `calc(${segment.lane} * var(--timeline-lane-height) + var(--timeline-lane-gap) / 2)`,
                  width: `${segment.widthPercent}%`,
                }}
                type="button"
              >
                {segment.labelLevel !== 'none' ? (
                  <strong className="timeline__segment-title">{segment.title}</strong>
                ) : null}
                {segment.labelLevel === 'full' ? (
                  <small className="timeline__segment-time">
                    {segment.startTime}-{segment.endTime}
                  </small>
                ) : null}
              </button>
            ))}
            {layout.isNowInRange ? (
              <span
                className="timeline__now"
                style={{
                  left: `${layout.nowPercent}%`,
                }}
                aria-label={`Current demo time ${layout.nowTime}`}
                title={`Current demo time: ${layout.nowTime}`}
              >
                <span>{layout.nowTime}</span>
              </span>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
