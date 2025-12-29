import { useQuery } from "@tanstack/react-query";
import {
  getContentSource,
  getLoginRefetchAlways,
  getLoginStaleHours,
} from "../../config/env";
import { getRegisterContentData } from "./register.repository";

const buildRegisterKey = () => ["register", "content", getContentSource()];

export const useRegisterContentQuery = () =>
  useQuery({
    queryKey: buildRegisterKey(),
    queryFn: getRegisterContentData,
    refetchOnMount: __DEV__ && getLoginRefetchAlways() ? "always" : true,
    staleTime:
      __DEV__ && getLoginRefetchAlways()
        ? 0
        : getLoginStaleHours() * 60 * 60 * 1000,
  });
