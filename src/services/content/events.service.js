import { strapiClient } from "../../lib/strapi/strapiClient";
import { normalizeDateValue } from "../../utils/dateFormatting";

const EVENTS_ENDPOINT = "/api/events";

export const getEvents = async (params = {}) => {
  try {
    const response = await strapiClient.get(EVENTS_ENDPOINT, params);
    return (response?.data || []).map((event) => ({
      id: String(event.id),
      title: event?.attributes?.title || "",
      startDateTime: normalizeDateValue(event?.attributes?.startAt),
      endDateTime: normalizeDateValue(event?.attributes?.endAt),
    }));
  } catch (error) {
    if (__DEV__) {
      // eslint-disable-next-line no-console
      console.warn("Events fetch failed", error);
    }
    return [];
  }
};
