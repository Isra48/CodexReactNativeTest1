import { strapiApi } from "../api/strapiApi";
import { getStrapiUrl } from "../../config/env";

const EVENTS_ENDPOINT = "/api/carrousels";

const resolveAssetUrl = (url) => {
  if (!url) return null;
  if (url.startsWith("http")) return url;
  const baseUrl = getStrapiUrl();
  if (!baseUrl) return url;
  const trimmedBase = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
  const path = url.startsWith("/") ? url : `/${url}`;
  return `${trimmedBase}${path}`;
};

const basePopulate = {
  populate: {
    image: {
      fields: ["url", "formats"],
    },
  },
};

const fields = ["title", "link"];

export const getEvents = async (params = {}) => {
  const response = await strapiApi.get(EVENTS_ENDPOINT, {
    fields,
    ...basePopulate,
    ...params,
  });
  return (response?.data || []).map((event) => {
    const attributes = event?.attributes || {};
    const imageAttributes = attributes?.image?.data?.attributes;
    const directImage =
      typeof attributes?.image === "string" ? attributes.image : null;
    const nestedImageUrl =
      attributes?.image?.url ||
      attributes?.image?.data?.url ||
      attributes?.image?.data?.attributes?.url ||
      null;
    const imageUrl =
      directImage ||
      nestedImageUrl ||
      imageAttributes?.formats?.medium?.url ||
      imageAttributes?.formats?.small?.url ||
      imageAttributes?.url ||
      null;

    return {
      id: String(event.id),
      name: attributes?.title || "",
      image: resolveAssetUrl(imageUrl),
      link: attributes?.link || "",
    };
  });
};
