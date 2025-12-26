import { isMockSource } from "../../config/env";
import * as classesService from "./classes.service";
import { mockClasses } from "../../constants/data";

/**
 * Utilidad: ordenar fechas
 */
const byDateAsc = (a, b) =>
  new Date(a.startDateTime) - new Date(b.startDateTime);

const byDateDesc = (a, b) =>
  new Date(b.startDateTime) - new Date(a.startDateTime);

/**
 * HERO:
 * - Si hay futuras → la más cercana
 * - Si no → la pasada más reciente
 */
export const getHeroClass = async () => {
  const now = new Date();

  const classes = isMockSource()
    ? mockClasses
    : await classesService.getClasses({ upcomingOnly: false });

  if (!classes || classes.length === 0) return null;

  const future = classes
    .filter(c => new Date(c.startDateTime) > now)
    .sort(byDateAsc);

  if (future.length > 0) {
    return future[0];
  }

  const past = classes
    .filter(c => new Date(c.startDateTime) <= now)
    .sort(byDateDesc);

  return past[0] || null;
};

/**
 * LISTADO HOME:
 * - Futuras si existen
 * - Si no → pasadas
 */
export const getHomeClasses = async ({ limit = 4 } = {}) => {
  const now = new Date();

  const classes = isMockSource()
    ? mockClasses
    : await classesService.getClasses({ upcomingOnly: false });

  if (!classes || classes.length === 0) return [];

  const future = classes
    .filter(c => new Date(c.startDateTime) > now)
    .sort(byDateAsc);

  if (future.length > 0) {
    return future.slice(0, limit);
  }

  return classes
    .filter(c => new Date(c.startDateTime) <= now)
    .sort(byDateDesc)
    .slice(0, limit);
};
