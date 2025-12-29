import { useQuery } from "@tanstack/react-query";
import { getContentSource } from "../../config/env";
import { getAllEvents } from "./events.repository";

const buildEventsKey = () => ["events", "all", getContentSource()];

export const useEventsQuery = () =>
  useQuery({
    queryKey: buildEventsKey(),
    queryFn: getAllEvents,
  });
