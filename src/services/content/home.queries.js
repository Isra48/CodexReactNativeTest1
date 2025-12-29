import { useQuery } from "@tanstack/react-query";
import { getContentSource } from "../../config/env";
import { getHomeContentData } from "./home.repository";

const buildHomeKey = () => ["home", "content", getContentSource()];

export const useHomeContentQuery = () =>
  useQuery({
    queryKey: buildHomeKey(),
    queryFn: getHomeContentData,
  });
