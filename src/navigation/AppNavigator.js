import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { navigationRef } from "./navigationRef";

import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import ProfileEditorScreen from "../screens/ProfileEditorScreen";
import HomeScreen from "../screens/HomeScreen";
import ClassesScreen from "../screens/ClassesScreen";
import SettingsScreen from "../screens/SettingsScreen";
import CustomTabBar from "../components/navigation/CustomTabBar";

const RootStack = createNativeStackNavigator();
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

/* ---------- AUTH STACK ---------- */
function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

/* ---------- APP TABS ---------- */
function AppTabs() {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Classes" component={ClassesScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

/* ---------- ROOT NAVIGATOR ---------- */
export default function AppNavigator({ logged }) {
  return (
    <NavigationContainer ref={navigationRef}>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>

        {/* Auth o App */}
        {!logged ? (
          <RootStack.Screen name="Auth" component={AuthStack} />
        ) : (
          <RootStack.Screen name="App" component={AppTabs} />
        )}

        {/* Perfil accesible desde cualquier lugar */}
        <RootStack.Screen
          name="ProfileEditor"
          component={ProfileEditorScreen}
          options={{
            headerShown: true,
            title: "",
            headerBackTitleVisible: false,
          }}
        />

      </RootStack.Navigator>
    </NavigationContainer>
  );
}
