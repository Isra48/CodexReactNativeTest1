import React from "react";
import AppNavigator from "./src/navigation/AppNavigator";
import useAuthStatus from "./src/hooks/useAuthStatus";
import { NotificationProvider } from "./src/context/NotificationContext";

export default function App() {
  const { logged, loading } = useAuthStatus();

  if (loading) return null;

  return (
    <NotificationProvider>
      <AppNavigator logged={logged} />
    </NotificationProvider>
  );
}
