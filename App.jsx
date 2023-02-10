import React, { useEffect, useMemo, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer} from '@react-navigation/native';
import { StyleSheet } from 'react-native';
import SearchCityAutocomplete from './components/SearchCityAutocomplete';
import { removeItem, retrieveData, storeData } from './utils/async-storage-manager';
import { MainWeatherContext } from './context/MainWeatherContext';
import CityWeather from './components/CityWeather';
import DayWeatherModal from './components/DayWeatherModal';
import { useWeatherStore } from './store';
import { shallow } from 'zustand/shallow';
import Home from './components/Home';

const Stack = createNativeStackNavigator();

function App(){
  const { citySelected, getCitySelected } = useWeatherStore((state) => 
  ({
    citySelected: state.citySelected,
    getCitySelected: state.getCitySelected,
  }), shallow);

  useEffect(() => {
    getCitySelected();
  }, []);

  const MyTheme = {
    colors: {
      primary: 'rgb(255, 45, 85)',
      background: '#1b1c1e',
      card: '#1f2329',
      text: '#f2f1f2',
      secondaryText: '#626365',
      border: '#1f2329',
    },
  };

  return (
    <NavigationContainer theme={MyTheme}>
      <Stack.Navigator>
          {
            citySelected ? (
              <Stack.Group screenOptions={{ presentation: 'modal' }}>
                <Stack.Screen name="CityWeather" component={CityWeather} options={{headerShown: false}} />
                <Stack.Screen name="DayWeatherModal" component={DayWeatherModal}  options={{headerShown: false}}/>
              </Stack.Group>
              ) : (
                <Stack.Group>
                  <Stack.Screen name="Home" component={Home} options={{headerShown: false}} />
                </Stack.Group>
            )
          }
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    },
  });

export default App;
