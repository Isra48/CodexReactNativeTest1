import {
  formatDateLabel,
  formatTimeLabel,
  normalizeDateValue,
} from "../../utils/dateFormatting";

const DEFAULT_TIMEZONE = "America/Mexico_City";

/**
 * Extrae texto plano desde Rich Text de Strapi
 * @param {string | Array} value
 * @returns {string}
 */
const extractTextFromRichText = (value) => {
  if (!value) return "";

  // Si ya es string (por compatibilidad futura)
  if (typeof value === "string") return value;

  // Rich text (array de bloques)
  if (Array.isArray(value)) {
    return value
      .map(
        (block) =>
          block?.children?.map((child) => child.text).join("") || ""
      )
      .join("\n");
  }

  return "";
};

/**
 * Mapea una clase de Strapi al modelo interno de la app
 * @param {Object} attributes
 * @param {string|number} id
 * @returns {Object}
 */
export const mapStrapiClassToAppModel = (attributes = {}, id) => {
  const startAtISO = normalizeDateValue(
    attributes.startAt ||
      attributes.start_date ||
      attributes.startDateTime
  );

  const endAtISO = normalizeDateValue(
    attributes.endAt ||
      attributes.end_date ||
      attributes.endDateTime
  );

  const timezone = attributes.timezone || DEFAULT_TIMEZONE;

  const dateLabel = startAtISO
    ? formatDateLabel(startAtISO, timezone)
    : "";

  const timeLabel = startAtISO
    ? formatTimeLabel(startAtISO, timezone)
    : "";

  // Imagen (Strapi Cloud o fallback)
  const imageUrl =
    attributes?.image?.url ||
    attributes?.image?.data?.attributes?.url ||
    null;

  const instructorName =
    attributes?.instructor?.name ||
    attributes.instructor ||
    "";

  return {
    id: String(id ?? attributes.id ?? ""),
    title: attributes.title || "",
    description: extractTextFromRichText(attributes.description),
    category: attributes.category || "",
    instructor: instructorName,
    date: dateLabel,
    time: timeLabel,
    modality: attributes.modality || "",
    materials: attributes.materials || "",
    startDateTime: startAtISO || "",
    endDateTime: endAtISO || null,
    timezone,
    zoomLink: attributes.zoomLink || "",
    isFeatured: Boolean(attributes.isFeatured),
    image: imageUrl,
  };
};
