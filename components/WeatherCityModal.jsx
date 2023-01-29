import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Button, Image, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomText from './CustomText';

function WeatherCityModal({route, navigation}) {
  const { coordinates } = route.params;
  const [weather, setWeather] = useState(null);
  const API_KEY = '7c33f92506484e488de44806232501';
  const API_ENDPOINT_CURRENT = `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=`;


  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const response = await axios.get(API_ENDPOINT_CURRENT+coordinates);
        setWeather(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    if (coordinates) {
      fetchWeatherData();
    }
  }, [coordinates]);

  return (
    <SafeAreaView style={{ flex: 1}}>
      {
        weather !== null ? 
        <View>
          <View style={{alignItems: 'center'}}>
            <CustomText size={'large'} isPrimary >{weather.location.name}</CustomText>
          </View>
          <View style={{alignItems: 'center'}}>
            <CustomText size={'mega'}>{weather.current.temp_c}°</CustomText>
            <View style={{flexDirection: 'row', }}>
              <CustomText>{weather.current.condition.text}</CustomText>
              <Image
                style={styles.tinyLogo}
                source={require('../assets/weather/64x64/night/113.png')}
              />
            </View>
          </View>
        </View>
          :
          <></>
      }
      {/* <Button onPress={() => navigation.goBack()} title="Dismiss" /> */}
    </SafeAreaView>
  );
}

export default WeatherCityModal;

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
  },
  tinyLogo: {
    width: 50,
    height: 50,
  },
  logo: {
    width: 66,
    height: 58,
  },
});
