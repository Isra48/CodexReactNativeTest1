import React from "react";
import AppNavigator from "./src/navigation/AppNavigator";
import useAuthStatus from "./src/hooks/useAuthStatus";

export default function App() {
  const { logged, loading } = useAuthStatus();

  if (loading) return null;

  return <AppNavigator logged={logged} />;
}
