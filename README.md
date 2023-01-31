
# Weather Forecast App

This is a simple weather forecasting application built using React Native. The app provides current weather conditions for a selected city, as well as a 7-day forecast.

## Features

- Search by city name
- Show the most important info about current weather
- Show forecast for the next 7 days

## Tech Stack

- [React Native](https://reactnative.dev/)
- [Weather API](https://www.weatherapi.com/) 
- [React Navigation](https://reactnavigation.org/docs/getting-started/)
- [Moment](https://momentjs.com/) 

## Installation

#### Step 1:

- Clone the repo
- Open it in your favorite editor
- Open a terminal and run

```bash
  yarn install
```

#### Step 2:
- Head over to https://www.weatherapi.com/ to get an API key. (You will have to sign up)
- Create a `.env` file in the root folder and put your keys in the file like this:

```
API_KEY=YourWeatherApiKeyHere
```

    
## Deployment

To deploy this project run for iOS:

```bash
  yarn ios
```

for Android:

```bash
yarn android
```


## Dependencies

```json
"dependencies": {
    "@react-native-async-storage/async-storage": "^1.17.11",
    "@react-navigation/native": "^6.1.2",
    "@react-navigation/native-stack": "^6.9.8",
    "axios": "^1.2.5",
    "moment": "^2.29.4",
    "react": "18.2.0",
    "react-native": "0.71.1",
    "react-native-dotenv": "^3.4.7",
    "react-native-safe-area-context": "^4.5.0",
    "react-native-screens": "^3.19.0",
    "react-native-vector-icons": "^9.2.0"
  },
```

## API Reference

#### Search Cities Autocomplete

```http
  GET /search.json
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `key` | `string` | **Required**. Your API key |
| `q` | `string` | **Required**. Pass US Zipcode, UK Postcode, Canada Postalcode, IP address, Latitude/Longitude (decimal degree) or city name. |

#### Forecast

```http
  GET /forecast.json
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `key` | `string` | **Required**. Your API key |
| `q` | `string` | **Required**. Pass US Zipcode, UK Postcode, Canada Postalcode, IP address, Latitude/Longitude (decimal degree) or city name. |
| `days` | `string` | **Required**. Number of days of weather forecast. Value ranges from 1 to 10|

## App Screenshots
![App Screenshot](https://user-images.githubusercontent.com/54822197/215671658-30222af8-2e1b-4b55-84eb-6062f1317854.png)

![App Screenshot](https://user-images.githubusercontent.com/54822197/215671652-3ebec44f-fadc-4038-a932-1103a502f7be.png)

![App Screenshot](https://user-images.githubusercontent.com/54822197/215671389-a98d5f7f-3e1b-4594-ac06-57e91ae25963.png)

