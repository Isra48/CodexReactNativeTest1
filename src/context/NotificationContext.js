import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import * as Notifications from "expo-notifications";
import * as SecureStore from "expo-secure-store";
import { navigationRef } from "../navigation/navigationRef";

const PUSH_ENABLED_KEY = "push_enabled";
const PROMPT_SEEN_KEY = "push_prompt_seen";
const PERMISSION_REQUESTED_KEY = "push_permission_requested";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const NotificationContext = createContext(null);

const storeBoolean = async (key, value) => {
  try {
    await SecureStore.setItemAsync(key, JSON.stringify(value));
  } catch (error) {
    console.warn("Failed to persist", key, error);
  }
};

const getStoredBoolean = async (key, defaultValue) => {
  try {
    const value = await SecureStore.getItemAsync(key);
    return value !== null ? JSON.parse(value) : defaultValue;
  } catch (error) {
    console.warn("Failed to read", key, error);
    return defaultValue;
  }
};

export function NotificationProvider({ children }) {
  const [pushEnabled, setPushEnabled] = useState(true);
  const [permissionStatus, setPermissionStatus] = useState("undetermined");
  const [promptSeen, setPromptSeen] = useState(false);
  const [permissionRequested, setPermissionRequested] = useState(false);
  const scheduledClasses = useRef(new Set());

  useEffect(() => {
    const loadPreferences = async () => {
      const [storedPush, storedPromptSeen, storedRequested, permissions] = await Promise.all([
        getStoredBoolean(PUSH_ENABLED_KEY, true),
        getStoredBoolean(PROMPT_SEEN_KEY, false),
        getStoredBoolean(PERMISSION_REQUESTED_KEY, false),
        Notifications.getPermissionsAsync(),
      ]);

      setPushEnabled(storedPush);
      setPromptSeen(storedPromptSeen);
      setPermissionRequested(storedRequested);
      setPermissionStatus(permissions.status ?? "undetermined");
    };

    loadPreferences();
  }, []);

  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(() => {
      if (navigationRef.isReady()) {
        navigationRef.navigate("Home");
      }
    });

    return () => subscription.remove();
  }, []);

  const togglePushEnabled = useCallback(async (value) => {
    setPushEnabled(value);
    await storeBoolean(PUSH_ENABLED_KEY, value);

    if (!value) {
      scheduledClasses.current.clear();
      await Notifications.cancelAllScheduledNotificationsAsync();
    }
  }, []);

  const markPromptSeen = useCallback(async () => {
    setPromptSeen(true);
    await storeBoolean(PROMPT_SEEN_KEY, true);
  }, []);

  const markPermissionRequested = useCallback(async () => {
    setPermissionRequested(true);
    await storeBoolean(PERMISSION_REQUESTED_KEY, true);
  }, []);

  const requestPermissions = useCallback(async () => {
    await markPromptSeen();
    await markPermissionRequested();
    const result = await Notifications.requestPermissionsAsync();
    setPermissionStatus(result.status ?? "undetermined");
    return result.status;
  }, [markPermissionRequested, markPromptSeen]);

  const refreshPermissions = useCallback(async () => {
    const status = await Notifications.getPermissionsAsync();
    setPermissionStatus(status.status ?? "undetermined");
    return status.status;
  }, []);

  const scheduleClassNotifications = useCallback(
    async (classInfo) => {
      if (!pushEnabled || permissionStatus !== "granted" || !classInfo?.startDateTime) return;
      if (classInfo.modality && classInfo.modality.toLowerCase() !== "zoom") return;

      const startDate = new Date(classInfo.startDateTime);
      if (Number.isNaN(startDate.getTime()) || startDate <= new Date()) return;

      if (scheduledClasses.current.has(classInfo.id)) return;

      const content = {
        title: classInfo.title,
        body: classInfo.description || "Tu clase está por comenzar",
        data: { link: classInfo.link || "https://zoom.us/j/123456789" },
      };

      const triggers = [startDate];
      const thirtyMinutesBefore = new Date(startDate.getTime() - 30 * 60 * 1000);
      if (thirtyMinutesBefore > new Date()) {
        triggers.push(thirtyMinutesBefore);
      }

      await Promise.all(
        triggers.map((triggerDate) =>
          Notifications.scheduleNotificationAsync({
            content,
            trigger: triggerDate,
          })
        )
      );

      scheduledClasses.current.add(classInfo.id);
    },
    [permissionStatus, pushEnabled]
  );

  const cancelAllNotifications = useCallback(async () => {
    scheduledClasses.current.clear();
    await Notifications.cancelAllScheduledNotificationsAsync();
  }, []);

  const value = useMemo(
    () => ({
      pushEnabled,
      permissionStatus,
      promptSeen,
      permissionRequested,
      shouldShowPermissionPrompt: !promptSeen && permissionStatus === "undetermined",
      togglePushEnabled,
      markPromptSeen,
      requestPermissions,
      refreshPermissions,
      scheduleClassNotifications,
      cancelAllNotifications,
    }),
    [
      cancelAllNotifications,
      markPromptSeen,
      permissionRequested,
      permissionStatus,
      promptSeen,
      pushEnabled,
      refreshPermissions,
      requestPermissions,
      scheduleClassNotifications,
      togglePushEnabled,
    ]
  );

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
}

export const useNotifications = () => useContext(NotificationContext);
