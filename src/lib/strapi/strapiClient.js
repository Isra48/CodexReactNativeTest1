import { httpClient } from "../http/httpClient";

const isObject = (value) => value && typeof value === "object" && !Array.isArray(value);

const flattenParams = (params, prefix) => {
  return Object.entries(params).reduce((acc, [key, value]) => {
    if (value === undefined || value === null) return acc;
    const paramKey = prefix ? `${prefix}[${key}]` : key;
    if (Array.isArray(value)) {
      value.forEach((item, index) => {
        Object.assign(acc, flattenParams({ [index]: item }, paramKey));
      });
    } else if (isObject(value)) {
      Object.assign(acc, flattenParams(value, paramKey));
    } else {
      acc[paramKey] = value;
    }
    return acc;
  }, {});
};

export const buildQuery = (params = {}) => {
  if (!params || Object.keys(params).length === 0) return "";
  const query = new URLSearchParams(flattenParams(params));
  const queryString = query.toString();
  return queryString ? `?${queryString}` : "";
};

export const strapiClient = {
  async get(path, params) {
    const query = buildQuery(params);
    return httpClient.get(`${path}${query}`);
  },
};

export default strapiClient;
