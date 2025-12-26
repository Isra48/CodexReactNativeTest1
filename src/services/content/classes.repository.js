import { getContentSource, isMockSource } from "../../config/env";
import {
  classes as mockClasses,
  getNextClass as getNextMockClass,
  getPastClasses as getPastMockClasses,
  getUpcomingClasses as getUpcomingMockClasses,
} from "../../constants/data";
import * as classesService from "./classes.service";

const wrapMockPromise = (data) => Promise.resolve(data);

export const getUpcomingClasses = async (options = {}) => {
  if (isMockSource()) {
    const now = options.now || new Date();
    const list = getUpcomingMockClasses(now);
    return options.limit ? list.slice(0, options.limit) : list;
  }
  return classesService.getClasses({ upcomingOnly: true, limit: options.limit });
};

export const getPastClasses = async (options = {}) => {
  if (isMockSource()) {
    const now = options.now || new Date();
    return wrapMockPromise(getPastMockClasses(now));
  }
  return classesService.getClasses({ upcomingOnly: false });
};

export const getNextClass = async () => {
  if (isMockSource()) {
    return wrapMockPromise(getNextMockClass());
  }
  const classes = await classesService.getClasses({ upcomingOnly: true, limit: 1 });
  return classes[0] || null;
};

export const getClassById = async (id) => {
  if (isMockSource()) {
    return wrapMockPromise(mockClasses.find((item) => item.id === id) || null);
  }
  return classesService.getClassById(id);
};

export const getContentSourceLabel = () => getContentSource();
