import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getContentSource } from "../../config/env";
import {
  getAllClasses,
  selectHeroClass,
  selectHomeClasses,
  selectUpcomingClasses,
  selectPastClasses,
} from "./classes.repository";

// Single query key for all class data avoids duplicate network calls.
const buildClassesKey = () => ["classes", "all", getContentSource()];

export const useAllClassesQuery = () =>
  useQuery({
    queryKey: buildClassesKey(),
    // Shared cache: all screens consume this without re-fetching.
    queryFn: getAllClasses,
  });

export const useHeroClassQuery = () => {
  const query = useAllClassesQuery();
  const data = useMemo(() => selectHeroClass(query.data || []), [query.data]);
  return { ...query, data };
};

export const useHomeClassesQuery = ({ limit = 4 } = {}) => {
  const query = useAllClassesQuery();
  const data = useMemo(
    () => selectHomeClasses(query.data || [], { limit }),
    [limit, query.data]
  );
  return { ...query, data };
};

export const useUpcomingClassesQuery = ({ limit = 50 } = {}) => {
  const query = useAllClassesQuery();
  const data = useMemo(
    () => selectUpcomingClasses(query.data || [], { limit }),
    [limit, query.data]
  );
  return { ...query, data };
};

export const usePastClassesQuery = () => {
  const query = useAllClassesQuery();
  const data = useMemo(() => selectPastClasses(query.data || []), [query.data]);
  return { ...query, data };
};
