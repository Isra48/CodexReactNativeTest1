import { formatDateLabel, formatTimeLabel, normalizeDateValue } from "../../utils/dateFormatting";

const DEFAULT_TIMEZONE = "America/Mexico_City";

/**
 * @param {import("../../types/strapi").StrapiClassAttributes} attributes
 * @param {string | number} id
 * @returns {import("../../types/strapi").AppClass}
 */
export const mapStrapiClassToAppModel = (attributes = {}, id) => {
  const startAtISO = normalizeDateValue(attributes.startAt || attributes.start_date || attributes.startDateTime);
  const endAtISO = normalizeDateValue(attributes.endAt || attributes.end_date || attributes.endDateTime);
  const timezone = attributes.timezone || DEFAULT_TIMEZONE;

  const dateLabel = startAtISO ? formatDateLabel(startAtISO, timezone) : attributes.date;
  const timeLabel = startAtISO ? formatTimeLabel(startAtISO, timezone) : attributes.time;

  const imageUrl = attributes?.image?.data?.attributes?.url || attributes.imageUrl || attributes.image?.url;
  const instructorName = attributes?.instructor?.name || attributes.instructor || "";

  return {
    id: String(id ?? attributes.id ?? ""),
    title: attributes.title || "",
    description: attributes.description || "",
    category: attributes.category || attributes?.categoryName || "",
    instructor: instructorName,
    date: dateLabel,
    time: timeLabel,
    modality: attributes.modality || "",
    materials: attributes.materials || "",
    durationMinutes: attributes.durationMinutes || attributes.duration || undefined,
    startDateTime: startAtISO || attributes.startDateTime || "",
    endDateTime: endAtISO || attributes.endDateTime || undefined,
    timezone,
    zoomLink: attributes.zoomLink || attributes.zoom_link || attributes.meetingUrl || "",
    isFeatured: Boolean(attributes.isFeatured),
    image: imageUrl || undefined,
  };
};
