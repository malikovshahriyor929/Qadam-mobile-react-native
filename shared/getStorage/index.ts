import AsyncStorage from "@react-native-async-storage/async-storage";

const GetStorage = async (key: string) => {
  const value = await AsyncStorage.getItem(key);
  return value;
};

const SetStorage = async <T>(key: string, data: T): Promise<void> => {
  const value = JSON.stringify(data);
  await AsyncStorage.setItem(key, value);
};

export { GetStorage, SetStorage };
