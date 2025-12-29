import { useQuery } from "@tanstack/react-query";
import { getContentSource } from "../../config/env";
import { getLoginContentData } from "./login.repository";

const buildLoginKey = () => ["login", "content", getContentSource()];

export const useLoginContentQuery = () =>
  useQuery({
    queryKey: buildLoginKey(),
    queryFn: getLoginContentData,
    refetchOnMount: "always",
  });
