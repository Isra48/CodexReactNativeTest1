import { strapiApi } from "../api/strapiApi";

const HOME_ENDPOINT = "/api/homes";

const fields = ["tituloCarrousel", "tituloDeListados"];

export const getHomeContent = async (params = {}) => {
  const response = await strapiApi.get(HOME_ENDPOINT, {
    fields,
    ...params,
  });
  const firstItem = response?.data?.[0];
  const attributes = firstItem?.attributes || {};

  return {
    carouselTitle: attributes?.tituloCarrousel || "",
    listTitle: attributes?.tituloDeListados || "",
  };
};
