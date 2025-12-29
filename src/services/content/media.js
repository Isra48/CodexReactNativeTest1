import { getStrapiUrl } from "../../config/env";

const DEFAULT_MEDIA_FIELDS = [
  "backgroundImage",
  "background",
  "media",
  "video",
  "image",
];

const VIDEO_EXTENSIONS = [".mp4", ".mov", ".m4v", ".webm", ".mkv"];

const resolveAssetUrl = (url) => {
  if (!url) return null;
  if (url.startsWith("http")) return url;
  const baseUrl = getStrapiUrl();
  if (!baseUrl) return url;
  const trimmedBase = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
  const path = url.startsWith("/") ? url : `/${url}`;
  return `${trimmedBase}${path}`;
};

const normalizeCandidate = (candidate) => {
  if (!candidate) return null;
  if (typeof candidate === "string") return { url: candidate };
  if (Array.isArray(candidate)) {
    const first = candidate[0];
    return first?.attributes || first || null;
  }
  const data = candidate?.data || candidate;
  return data?.attributes || data || null;
};

const guessMediaType = (mime, url) => {
  if (mime && mime.startsWith("video")) return "video";
  const lower = url?.toLowerCase() || "";
  if (VIDEO_EXTENSIONS.some((ext) => lower.endsWith(ext))) return "video";
  return "image";
};

export const extractMediaFromAttributes = (
  attributes,
  fieldNames = DEFAULT_MEDIA_FIELDS
) => {
  if (!attributes) return null;
  for (const fieldName of fieldNames) {
    const candidate = attributes?.[fieldName];
    if (!candidate) continue;
    const attrs = normalizeCandidate(candidate);
    if (!attrs?.url) continue;
    const resolvedUrl = attrs?.formats?.large?.url ||
      attrs?.formats?.medium?.url ||
      attrs?.formats?.small?.url ||
      attrs?.url ||
      null;
    if (!resolvedUrl) continue;
    const mime = attrs?.mime || "";
    return {
      url: resolveAssetUrl(resolvedUrl),
      mime,
      type: guessMediaType(mime, resolvedUrl),
    };
  }

  return null;
};
