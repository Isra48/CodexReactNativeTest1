import { isUsingStrapi } from "../../config/env";
import { getHomeContent } from "./home.service";

const fallbackContent = {
  carouselTitle: "Eventos presenciales",
  listTitle: "Próximas clases",
};

export const getHomeContentData = async () => {
  if (!isUsingStrapi()) {
    return fallbackContent;
  }
  const content = await getHomeContent();
  if (!content?.carouselTitle && !content?.listTitle) {
    return fallbackContent;
  }
  return {
    carouselTitle: content.carouselTitle || fallbackContent.carouselTitle,
    listTitle: content.listTitle || fallbackContent.listTitle,
  };
};
