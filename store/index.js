import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { create } from 'zustand';
import { persist, createJSONStorage } from "zustand/middleware";
import { API_KEY } from '@env';
import moment from 'moment';

const API_ENDPOINT = 'https://api.weatherapi.com/v1/';
const FORECAST_DAYS = 7;
const FORECAST_ENDPOINT = `forecast.json?key=${API_KEY}&aqi=no&alerts=no&days=${FORECAST_DAYS}&q=`;
const TWELVE_HOURS = 12;
const emptyWeatherObject = {
    location: {
        name: '-'
      },
      current: {
        temp_c: '-',
        condition: {
          text: '-',
          icon: '',
          wind_kph: '',
          uv: '',
          humidity: '',
        }
      },
      forecast: {
        forecastday: []
      }
};

export const useWeatherStore = create(persist(
    (set, get) => ({
        cities: [],
        cityWeather: emptyWeatherObject,
        citySelected: null,
        isLoading: false,
        weatherByDay: {
            day: {
                mintemp_c: '',
                maxtemp_c: '',
                uv: '',
            },
            hour: [],
        },
        error: null,

        getWeatherByCity: async (coordinates, updateWeather) => {
            set({
                isLoading: true,
            });
            
            try {
                const { cityWeather } = get();
                // if cityweather we know there is data in storage or current state
                // so we can retrive data from storage or current state without fetch data 
                if(cityWeather && cityWeather.current && cityWeather.current.last_updated && !updateWeather)
                {
                    const now = moment();
                    const dataAge = now.diff(moment(cityWeather.current.last_updated), 'hours');
                    if(dataAge < TWELVE_HOURS){
                        set({
                            isLoading: false
                        })
                        return;
                    }
                }

                const response = await axios.get(API_ENDPOINT + FORECAST_ENDPOINT + coordinates);
                set((state) => ({
                    ...state,
                    cityWeather: response.data,
                    isLoading: false,
                }))

            } catch (error) {
                set({
                    error,
                    isLoading: false,
                });
            }
        },

        getCitySelected: async () => {
            set({
                isLoading: true,
            });
            try {
                set({citySelected, cities, isLoading: false});
            } catch(error) {
                set({error});
            }
        },

        setCitySelected: async city => {
            try {
                const { cities } = get();
                if(cities && cities.length > 0 && cities.find((item) => item.name === city.name)) {
                    set(() => ({
                        citySelected: city,
                    }))
                } else {
                    set((prevState) => ({
                        cities: [...prevState.cities, city],
                        citySelected: city, 
                    }));
                }
            } catch (error) {
                set({
                    error
                });
            }

        },

        getWeatherByDay: day => {
            set({
                isLoading: true,
            });
            const { cityWeather } = get();
            const dayfound = cityWeather.forecast.forecastday.find((item) => item.date == day);
            set({weatherByDay: dayfound, isLoading: false});
        },

        removeCitySelected: async () => {
            set({citySelected: null, cityWeather: emptyWeatherObject})
        },

        getCities: () => {
            const { cities } = get();
            set({cities});
        }
    }), 
    {
        name: "weather-storage",
        storage: createJSONStorage(() => AsyncStorage),
    }
)
)