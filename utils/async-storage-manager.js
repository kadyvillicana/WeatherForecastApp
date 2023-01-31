import AsyncStorage from '@react-native-async-storage/async-storage';

const storeData = async (key, data) => {
  try {
    const jsonValue = JSON.stringify(data);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (error) {
    console.log(error);
  }
};

const retrieveData = async key => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    if (jsonValue !== null) {
      return JSON.parse(jsonValue);
    }
  } catch (error) {
    console.log(error);
  }
};

const removeItem = async key => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.log(error);
  }
}

export { storeData, retrieveData, removeItem };
