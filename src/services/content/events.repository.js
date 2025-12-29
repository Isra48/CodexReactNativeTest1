import { isUsingStrapi } from "../../config/env";
import { categories } from "../../constants/data";
import { getEvents } from "./events.service";

export const getAllEvents = async () => {
  if (!isUsingStrapi()) {
    return categories;
  }
  const events = await getEvents();
  const fallbackImage = categories[0]?.image || null;
  return events.map((event) => {
    if (event.image) return event;
    const match = categories.find(
      (category) =>
        category?.name?.toLowerCase() === event?.name?.toLowerCase()
    );
    return {
      ...event,
      image: match?.image || fallbackImage,
    };
  });
};
