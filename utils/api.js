import axios from 'axios';
import moment from 'moment';
import { retrieveData, storeData } from './async-storage-manager';
import { API_KEY } from '@env';

const API_ENDPOINT = 'https://api.weatherapi.com/v1/';
const SEARCH_ENDPOINT = `search.json?key=${API_KEY}&q=`;
const FORECAST_DAYS = 7;
const FORECAST_ENDPOINT = `forecast.json?key=${API_KEY}&aqi=no&alerts=no&days=${FORECAST_DAYS}&q=`;

const TWELVE_HOURS = 12;

const getAutocompleteCities = async query => {
  try {
    const response = await axios.get(API_ENDPOINT + SEARCH_ENDPOINT + query);
    if (response && response.data) {
      return response.data;
    }
  }
  catch (error) {
    console.log(error);
  }
}

const getCityWeather = async (coordinates, updateWeather) => {
  try {
    const storedData = await retrieveData('cityWeather');
    const now = moment();
    if (storedData && !updateWeather) {
      const dataAge = now.diff(moment(storedData.current.last_updated), 'hours');
      if (dataAge < TWELVE_HOURS) {
        return storedData;
      }
    }
    const response = await axios.get(API_ENDPOINT + FORECAST_ENDPOINT + coordinates);
    if (response && response.data) {
      await storeData('cityWeather', response.data);
      return response.data;
    }
  } catch (error) {
    console.log(error);
  }
}

const getDayWeather = async day => {
  try {
    const storedData = await retrieveData('cityWeather');
    if (storedData && storedData.forecast && storedData.forecast.forecastday) {
      return storedData.forecast.forecastday.find((item) => item.date == day);

    }
  } catch (error) {
    console.log(error);
  }
}

export { getAutocompleteCities, getCityWeather, getDayWeather };