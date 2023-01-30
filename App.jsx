import React, { useEffect, useMemo, useState, } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer} from '@react-navigation/native';
import { StyleSheet } from 'react-native';
import SearchCityAutocomplete from './components/SearchCityAutocomplete';
import { removeItem, retrieveData, storeData } from './utils/async-storage-manager';
import { MainWeatherContext } from './context/MainWeatherContext';
import WeatherCityModal from './components/CityWeather';

const Stack = createNativeStackNavigator();

function App(){
  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_CITY':
          return {
            ...prevState,
            city: action.city,
            isLoading: false,
            isCitySelected: true,
          };
        case 'SET_CITY':
          return {
            ...prevState,
            isCitySelected: true,
            city: action.city,
          };
        case 'REMOVE_CITY':
          return {
            ...prevState,
            isCitySelected: false,
            city: null,
          };
      }
    },
    {
      isLoading: true,
      isCitySelected: false,
      city: null,
    }
  );
  
  useEffect(() => {
    const bootstrapAsync = async () => {
      let citySelected;
      try {
        citySelected = await retrieveData('citySelected');
      }
      catch (error) {
        console.log(error);
      }
      dispatch({type: 'RESTORE_CITY', city: citySelected})
    }
    bootstrapAsync();
  }, []);

  const cityContext = useMemo(
    () => ({
      setCity: async (data) => {
        await storeData('citySelected', data);
        dispatch({ type: 'SET_CITY', city: data });
      },
      removeCity: async () =>  {
        dispatch({ type: 'REMOVE_CITY' })
        await removeItem('citySelected');
      },
      state,
    }),
    [state]
  );

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
    <MainWeatherContext.Provider value={cityContext}>
      <NavigationContainer theme={MyTheme}>
        <Stack.Navigator>
          <Stack.Group>
            {
              state.isCitySelected ? (
                <Stack.Screen name="WeatherCityModal" component={WeatherCityModal} options={{headerShown: false}} />
              ) : (
                <Stack.Screen name="Home" component={SearchCityAutocomplete} options={{headerShown: false}} />
              )
            }
          </Stack.Group>
          {/* <Stack.Group screenOptions={{ presentation: 'modal' }}>
          </Stack.Group> */}
          {/* {state.isCitySelected ? (
            <Stack.Screen name="City" component={MainWeatherScreen} />
            ): (
            <Stack.Screen name="SearchCity" component={SearchCityAutocomplete} />
          )} */}
        </Stack.Navigator>
      </NavigationContainer>
    </MainWeatherContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    },
  });

export default App;
