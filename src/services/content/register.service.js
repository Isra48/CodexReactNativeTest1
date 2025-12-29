import { strapiApi } from "../api/strapiApi";
import { extractMediaFromAttributes } from "./media";

const REGISTER_ENDPOINT = "/api/register";

const pickAttributes = (response) => {
  const payload = response?.data;
  if (Array.isArray(payload)) {
    return payload[0]?.attributes || {};
  }
  if (payload?.data) {
    if (Array.isArray(payload.data)) {
      return payload.data[0]?.attributes || {};
    }
    return payload.data?.attributes || {};
  }
  return payload?.attributes || {};
};

export const getRegisterContent = async (params = {}) => {
  const response = await strapiApi.get(REGISTER_ENDPOINT, {
    fields: ["title", "description"],
    populate: "*",
    ...params,
  });
  const attributes = pickAttributes(response);
  const backgroundMedia = extractMediaFromAttributes(attributes);

  return {
    title: attributes?.title || "",
    description: attributes?.description || "",
    backgroundMedia,
  };
};
