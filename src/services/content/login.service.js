import { strapiApi } from "../api/strapiApi";
import { getStrapiUrl } from "../../config/env";

const LOGIN_ENDPOINT = "/api/login";

const resolveAssetUrl = (url) => {
  if (!url) return null;
  if (url.startsWith("http")) return url;
  const baseUrl = getStrapiUrl();
  if (!baseUrl) return url;
  const trimmedBase = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
  const path = url.startsWith("/") ? url : `/${url}`;
  return `${trimmedBase}${path}`;
};

const pickMediaAttributes = (attributes) => {
  const candidates = [
    attributes?.backgroundImage,
    attributes?.background,
    attributes?.media,
    attributes?.video,
    attributes?.image,
  ];

  for (const candidate of candidates) {
    if (!candidate) continue;
    if (Array.isArray(candidate) && candidate.length > 0) {
      const first = candidate[0];
      const attrs = first?.attributes || first;
      if (attrs?.url) return attrs;
      continue;
    }
    const data = candidate?.data || candidate;
    const attrs = data?.attributes || data;
    if (attrs?.url) return attrs;
  }

  return null;
};

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

export const getLoginContent = async (params = {}) => {
  const response = await strapiApi.get(LOGIN_ENDPOINT, {
    fields: ["title", "description"],
    populate: "*",
    ...params,
  });
  const attributes = pickAttributes(response);
  const mediaAttributes = pickMediaAttributes(attributes);
  const mediaUrl =
    mediaAttributes?.formats?.large?.url ||
    mediaAttributes?.formats?.medium?.url ||
    mediaAttributes?.formats?.small?.url ||
    mediaAttributes?.url ||
    null;
  const mime = mediaAttributes?.mime || "";

  return {
    title: attributes?.title || "",
    description: attributes?.description || "",
    backgroundMedia: mediaUrl
      ? {
          url: resolveAssetUrl(mediaUrl),
          mime,
          type: mime.startsWith("video") ? "video" : "image",
        }
      : null,
  };
};
