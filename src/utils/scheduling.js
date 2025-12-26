const MINUTES = 60 * 1000;
const STARTING_SOON_WINDOW_MINUTES = 30;

export const computeClassStatus = (startAtISO, now = new Date()) => {
  if (!startAtISO) return "future";
  const startDate = new Date(startAtISO);
  if (Number.isNaN(startDate.getTime())) return "future";

  const nowTime = now instanceof Date ? now.getTime() : now;
  const startTime = startDate.getTime();
  const liveWindowEnd = startTime + 90 * MINUTES;
  const startingSoonWindow = startTime - STARTING_SOON_WINDOW_MINUTES * MINUTES;

  if (nowTime >= startTime && nowTime <= liveWindowEnd) return "live";
  if (nowTime >= startingSoonWindow && nowTime < startTime) return "startingSoon";
  if (nowTime < startingSoonWindow) return "future";
  return "past";
};

export const computeReminderTriggerDate = (startAtISO, minutesBefore = 5) => {
  if (!startAtISO) return null;
  const startDate = new Date(startAtISO);
  if (Number.isNaN(startDate.getTime())) return null;
  return new Date(startDate.getTime() - minutesBefore * MINUTES);
};
