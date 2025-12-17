import * as SecureStore from "expo-secure-store";

export const getUser = async () => {
  const value = await SecureStore.getItemAsync("user");
  return value ? JSON.parse(value) : null;
};

export const setUser = async (user) => {
  await SecureStore.setItemAsync("user", JSON.stringify(user));
};

export const deleteUser = async () => {
  await SecureStore.deleteItemAsync("user");
};
