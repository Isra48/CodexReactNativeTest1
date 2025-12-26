import { strapiClient } from "../../lib/strapi/strapiClient";
import { mapStrapiClassToAppModel } from "./mappers";

const CLASSES_ENDPOINT = "/api/classes";

const basePopulate = {
  populate: {
    image: true,
    instructor: true,
  },
};

const buildFilters = ({ upcomingOnly }) => {
  if (!upcomingOnly) return undefined;
  const nowIso = new Date().toISOString();
  return {
    filters: {
      startAt: {
        $gte: nowIso,
      },
    },
  };
};

export const getClasses = async ({ upcomingOnly, limit } = {}) => {
  const filters = buildFilters({ upcomingOnly });
  const pagination = limit ? { pagination: { limit } } : undefined;
  const response = await strapiClient.get(CLASSES_ENDPOINT, {
    ...basePopulate,
    ...filters,
    ...pagination,
    sort: { startAt: "asc" },
  });

  return (response?.data || []).map((item) => mapStrapiClassToAppModel(item.attributes, item.id));
};

export const getClassById = async (id) => {
  if (!id) return null;
  const response = await strapiClient.get(`${CLASSES_ENDPOINT}/${id}`, basePopulate);
  const attributes = response?.data?.attributes;
  if (!attributes) return null;
  return mapStrapiClassToAppModel(attributes, response.data.id);
};
