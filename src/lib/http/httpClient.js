import { config, getStrapiToken, getStrapiUrl } from "../../config/env";

const DEFAULT_TIMEOUT_MS = 75000;

const withTimeout = async (promise, timeoutMs = DEFAULT_TIMEOUT_MS) => {
  let timeoutId;
  const timeoutPromise = new Promise((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error("Request timed out")), timeoutMs);
  });
  return Promise.race([
    promise.finally(() => clearTimeout(timeoutId)),
    timeoutPromise,
  ]);
};

const buildHeaders = () => {
  const headers = { "Content-Type": "application/json" };
  const token = getStrapiToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
};

const log = (...args) => {
  if (__DEV__) {
    // eslint-disable-next-line no-console
    console.log("[http]", ...args);
  }
};

export const httpClient = {
  async get(path, { params, timeoutMs } = {}) {
    const baseURL = getStrapiUrl() || config.strapiUrl;
    const url = new URL(path, baseURL);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, value);
        }
      });
    }

    const request = fetch(url.toString(), {
      method: "GET",
      headers: buildHeaders(),
    });

    try {
      log("GET", url.toString());
      const response = await withTimeout(request, timeoutMs);
      const json = await response.json();
      if (!response.ok) {
        const message = json?.error?.message || response.statusText;
        throw new Error(message || "Request failed");
      }
      return json;
    } catch (error) {
      log("GET error", error?.message || error);
      throw error;
    }
  },
};

export default httpClient;
