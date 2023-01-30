import axios from "axios";

const API_KEY = '7c33f92506484e488de44806232501';
const API_ENDPOINT = 'https://api.weatherapi.com/v1/'
const SEARCH_ENDPOINT = `search.json?key=${API_KEY}&q=`;
const FORECAST_ENDPOINT = `forecast.json?key=${API_KEY}&aqi=no&alerts=no&days=7&q=`;

const getAutocompleteCities = async (query) => {
  try {
    const response = await axios.get(API_ENDPOINT + SEARCH_ENDPOINT + query);
		if(response && response.data) {
			return response.data
		}
  }
	catch (error) {
		console.log(error);
	}
}

const getCityWeather = async (coordinates) => {
	try {
		const response = await axios.get(API_ENDPOINT + FORECAST_ENDPOINT + coordinates);
		if(response && response.data) {
			return response.data;
		}
	} catch (error) {
		console.log(error);
	}
}

export { getAutocompleteCities, getCityWeather };