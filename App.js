import React from "react";
import AppNavigator from "./src/navigation/AppNavigator";
import useAuthStatus from "./src/hooks/useAuthStatus";
import { NotificationProvider } from "./src/context/NotificationContext";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { asyncStoragePersister, PERSIST_MAX_AGE_MS, queryClient } from "./src/lib/query/queryClient";

export default function App() {
  const { logged, loading } = useAuthStatus();

  if (loading) return null;

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister: asyncStoragePersister,
        maxAge: PERSIST_MAX_AGE_MS,
        buster: "strapi-v4-fields-1",
        dehydrateOptions: {
          shouldDehydrateQuery: (query) => query.state.status === "success",
        },
      }}
    >
      <NotificationProvider>
        <AppNavigator logged={logged} />
      </NotificationProvider>
    </PersistQueryClientProvider>
  );
}
