import Constants from "expo-constants";

const DEFAULT_CONTENT_SOURCE = "mock";

const getExpoExtra = () => Constants.expoConfig?.extra || {};

const readEnvValue = (key) => {
  const extra = getExpoExtra();
  if (extra && extra[key] !== undefined) return extra[key];
  if (typeof process !== "undefined" && process.env && process.env[key] !== undefined) {
    return process.env[key];
  }
  return undefined;
};

export const getStrapiUrl = () => readEnvValue("STRAPI_URL") || "";
export const getStrapiToken = () => readEnvValue("STRAPI_API_TOKEN") || "";
export const getContentSource = () => (readEnvValue("CONTENT_SOURCE") || DEFAULT_CONTENT_SOURCE).toLowerCase();

export const isUsingStrapi = () => getContentSource() === "strapi";
export const isMockSource = () => !isUsingStrapi();

export const config = {
  strapiUrl: getStrapiUrl(),
  strapiToken: getStrapiToken(),
  contentSource: getContentSource(),
};
