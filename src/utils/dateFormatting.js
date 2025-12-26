const toDate = (value) => {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

export const normalizeDateValue = (value) => {
  const date = toDate(value);
  return date ? date.toISOString() : undefined;
};

export const formatDateLabel = (isoDate, timeZone = "America/Mexico_City") => {
  const date = toDate(isoDate);
  if (!date) return "";
  return date.toLocaleDateString("es-MX", { day: "2-digit", month: "short", timeZone }).replace(".", "");
};

export const formatTimeLabel = (isoDate, timeZone = "America/Mexico_City") => {
  const date = toDate(isoDate);
  if (!date) return "";
  return date.toLocaleTimeString("es-MX", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone,
  });
};
