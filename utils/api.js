import axios from 'axios';
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

export { getAutocompleteCities };