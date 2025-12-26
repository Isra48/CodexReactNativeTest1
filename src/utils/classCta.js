import { useEffect, useState } from "react";

const JOIN_WINDOW_MS = 5 * 60 * 1000;
const DEFAULT_DURATION_MINUTES = 90;
const DEFAULT_TICK_MS = 30000;

export const getClassCTAState = (item, now = Date.now()) => {
  if (!item?.startDateTime) return "upcoming";

  const start = new Date(item.startDateTime);
  if (Number.isNaN(start.getTime())) return "upcoming";

  const durationMinutes = item.durationMinutes ?? DEFAULT_DURATION_MINUTES;
  const durationMs = durationMinutes * 60000;

  const nowMs = typeof now === "number" ? now : now.getTime();
  const startMs = start.getTime();

  const windowStart = startMs - JOIN_WINDOW_MS;
  const windowEnd = startMs + durationMs;

  if (nowMs < windowStart) return "upcoming";

  if (nowMs <= windowEnd) {
    return nowMs < startMs ? "starting_soon" : "live";
  }

  return "past";
};

export const shouldShowJoinCTA = (item, state) => {
  if (!item?.zoomLink) return false;
  return state === "starting_soon" || state === "live";
};

export const useClassCTAState = (item, tickMs = DEFAULT_TICK_MS) => {
  const [state, setState] = useState(() =>
    getClassCTAState(item, Date.now())
  );

  useEffect(() => {
    setState(getClassCTAState(item, Date.now()));
    if (!item?.startDateTime) return;

    const interval = setInterval(() => {
      setState(getClassCTAState(item, Date.now()));
    }, tickMs);

    return () => clearInterval(interval);
  }, [item?.startDateTime, item?.durationMinutes, tickMs]);

  return state;
};
