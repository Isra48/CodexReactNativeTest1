import { strapiClient } from "../../lib/strapi/strapiClient";

export const strapiApi = {
  async get(path, params) {
    if (__DEV__) {
      // Log real network calls in the service layer.
      // eslint-disable-next-line no-console
      console.log("[strapi] GET", path);
    }
    return strapiClient.get(path, params);
  },
};

export default strapiApi;
