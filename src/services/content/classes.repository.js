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
   SOURCE
========================= */
export const getAllClasses = async () =>
  (isMockSource()
    ? mockClasses
    : await classesService.getClasses({ upcomingOnly: false })) || [];

/* =========================
   SELECTORS
========================= */
export const selectHeroClass = (classes = []) => {
  if (!classes?.length) return null;

  const future = classes
    .filter((c) => new Date(c.startDateTime) > now())
    .sort(byDateAsc);

  if (future.length) return future[0];

  return classes
    .filter((c) => new Date(c.startDateTime) <= now())
    .sort(byDateDesc)[0] || null;
};

/* =========================
   HOME LIST
========================= */
export const selectHomeClasses = (classes = [], { limit = 4 } = {}) => {
  if (!classes?.length) return [];

  const future = classes
    .filter((c) => new Date(c.startDateTime) > now())
    .sort(byDateAsc);

  const past = classes
    .filter((c) => new Date(c.startDateTime) <= now())
    .sort(byDateDesc);

  return [...future, ...past].slice(0, limit);
};

/* =========================
   CLASSES SCREEN
========================= */
export const selectUpcomingClasses = (classes = [], { limit = 50 } = {}) => {
  const nowRelevant = classes.filter((c) => {
    const status = computeClassStatus(c.startDateTime);
    return status === "upcoming" || status === "starting_soon" || status === "live";
  });

  return nowRelevant
    .sort((a, b) => new Date(a.startDateTime) - new Date(b.startDateTime))
    .slice(0, limit);
};

export const selectPastClasses = (classes = []) =>
  classes
    .filter((c) => new Date(c.startDateTime) <= now())
    .sort(byDateDesc);

/* =========================
   HERO (Home)
========================= */
export const getHeroClass = async () => {
  const classes = await getAllClasses();
  return selectHeroClass(classes);
};

/* =========================
   HOME LIST
========================= */
export const getHomeClasses = async ({ limit = 4 } = {}) => {
  const classes = await getAllClasses();
  return selectHomeClasses(classes, { limit });
};

/* =========================
   CLASSES SCREEN
========================= */
export const getUpcomingClasses = async ({ limit = 50 } = {}) => {
  const all = await getAllClasses();
  return selectUpcomingClasses(all, { limit });
};

export const getPastClasses = async () => {
  const classes = await getAllClasses();
  return selectPastClasses(classes);
};
