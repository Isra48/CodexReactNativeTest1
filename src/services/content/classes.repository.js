import { isMockSource } from "../../config/env";
import * as classesService from "./classes.service";
import { mockClasses } from "../../constants/data";
import { computeClassStatus } from "../../utils/scheduling";

/* =========================
   Utilidades
========================= */
const now = () => new Date();

const byDateAsc = (a, b) =>
  new Date(a.startDateTime) - new Date(b.startDateTime);

const byDateDesc = (a, b) =>
  new Date(b.startDateTime) - new Date(a.startDateTime);

/* =========================
   HERO (Home)
========================= */
export const getHeroClass = async () => {
  const classes = isMockSource()
    ? mockClasses
    : await classesService.getClasses({ upcomingOnly: false });

  if (!classes?.length) return null;

  const future = classes
    .filter(c => new Date(c.startDateTime) > now())
    .sort(byDateAsc);

  if (future.length) return future[0];

  return classes
    .filter(c => new Date(c.startDateTime) <= now())
    .sort(byDateDesc)[0] || null;
};

/* =========================
   HOME LIST
========================= */
export const getHomeClasses = async ({ limit = 4 } = {}) => {
  const classes = isMockSource()
    ? mockClasses
    : await classesService.getClasses({ upcomingOnly: false });

  if (!classes?.length) return [];

  const future = classes
    .filter(c => new Date(c.startDateTime) > now())
    .sort(byDateAsc);

  if (future.length) return future.slice(0, limit);

  return classes
    .filter(c => new Date(c.startDateTime) <= now())
    .sort(byDateDesc)
    .slice(0, limit);
};

/* =========================
   CLASSES SCREEN
========================= */
export const getUpcomingClasses = async ({ limit = 50 } = {}) => {
  const all = await classesService.getClasses({
    upcomingOnly: false, // 👈 TRAE TODAS
  });

  const nowRelevant = all.filter((c) => {
    const status = computeClassStatus(c.startDateTime);
    return status === "future" || status === "startingSoon" || status === "live";
  });

  return nowRelevant
    .sort((a, b) => new Date(a.startDateTime) - new Date(b.startDateTime))
    .slice(0, limit);
};

export const getPastClasses = async () => {
  const classes = isMockSource()
    ? mockClasses
    : await classesService.getClasses({ upcomingOnly: false });

  return classes
    .filter(c => new Date(c.startDateTime) <= now())
    .sort(byDateDesc);
};
