const MINUTES = 60 * 1000;
const STARTING_SOON_WINDOW_MINUTES = 30;

/**
 * Determina el estado de una clase según su startDateTime
 */
export const computeClassStatus = (startAtISO, now = new Date()) => {
  if (!startAtISO) return "upcoming";

  const startDate = new Date(startAtISO);
  if (Number.isNaN(startDate.getTime())) return "upcoming";

  const nowTime = now instanceof Date ? now.getTime() : now;
  const startTime = startDate.getTime();

  const liveWindowEnd = startTime + 90 * MINUTES;
  const startingSoonWindow = startTime - STARTING_SOON_WINDOW_MINUTES * MINUTES;

  if (nowTime >= startTime && nowTime <= liveWindowEnd) {
    return "live";
  }

  if (nowTime >= startingSoonWindow && nowTime < startTime) {
    return "starting_soon";
  }

  if (nowTime < startingSoonWindow) {
    return "upcoming";
  }

  return "past";
};

/**
 * Calcula cuándo disparar una notificación de recordatorio
 */
export const computeReminderTriggerDate = (startAtISO, minutesBefore = 5) => {
  if (!startAtISO) return null;

  const startDate = new Date(startAtISO);
  if (Number.isNaN(startDate.getTime())) return null;

  return new Date(startDate.getTime() - minutesBefore * MINUTES);
};

/**
 * Indica si debe mostrarse el CTA de "Entrar"
 */
export const shouldShowJoinCTA = (status) => status === "live";
