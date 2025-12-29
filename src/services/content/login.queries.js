import { useQuery } from "@tanstack/react-query";
import { getContentSource, getLoginRefetchAlways, getLoginStaleHours } from "../../config/env";
import { getLoginContentData } from "./login.repository";

const buildLoginKey = () => ["login", "content", getContentSource()];

export const useLoginContentQuery = () =>
  useQuery({
    queryKey: buildLoginKey(),
    queryFn: getLoginContentData,
    // Login content is static-ish; rely on cache to cut API calls.
    refetchOnMount: __DEV__ && getLoginRefetchAlways() ? "always" : true,
    staleTime:
      __DEV__ && getLoginRefetchAlways()
        ? 0
        : getLoginStaleHours() * 60 * 60 * 1000,
  });
