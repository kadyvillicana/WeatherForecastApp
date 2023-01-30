import { useTheme } from '@react-navigation/native';
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import CustomIcon from './CustomIcon';
import CustomText from './CustomText';
import moment from "moment";
import { MainWeatherContext } from '../context/MainWeatherContext';
import { getCityWeather } from '../utils/api';


function CityWeather({navigation}) {
  const { colors } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const { state, removeCity } = useContext(MainWeatherContext);
  const coordinates = state.city;
  const [weather, setWeather] = useState({
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
  });

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const data = await getCityWeather(coordinates, false);
        setWeather(data);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    };

    if (coordinates) {
      fetchWeatherData();
    }
  }, [coordinates]);

  const refreshWeatherData = () => {
    const fetchWeatherData = async () => {
      try {
        const data = await getCityWeather(coordinates, true);
        setWeather(data);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    setIsLoading(true);
    fetchWeatherData();
  }

  const dayWeatherItemList = ({item}) => {
    const date = moment(item.date);
    const isToday = moment().isSame(date, 'day');
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('DayWeatherModal', {day: item.date})}>
        <View style={{alignItems: 'center', justifyContent:'space-around', flexDirection: 'row', margin: 15}}>
          <View style={{flex: 1}}>
            <Image
              style={styles.logo}
              source={{uri: item.day.condition.icon.replace(/^\/\//, "https:")}}
            />
          </View>
          <View style={{flex: 3, justifyContent:'flex-start'}}>
            <CustomText size={'medium'} isPrimary>{isToday ? 'Today' : date.format('dddd')}</CustomText>
            <CustomText style={{paddingTop: 5}}>{item.day.condition.text}</CustomText>
          </View>
          <View style={{flex: 2, flexDirection: 'row', justifyContent:'flex-end'}}>
            <CustomText size={'medium'}>{item.day.mintemp_c}° / </CustomText>
            <CustomText size={'medium'}>{item.day.maxtemp_c}°</CustomText>
          </View>
        </View>
      </TouchableOpacity>
    )

  }

  if(isLoading) {
    return (
      <SafeAreaView style={{flex:1, alignItems: 'center', justifyContent: 'center'}}>
        <ActivityIndicator />
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={{flex: 1, marginTop: 15}}>
        <View style={{flex: 1}}>
          <View style={{alignItems: 'center', flexDirection: 'row', justifyContent: 'space-around'}}>
            <TouchableOpacity
              onPress={() => { removeCity() }}>
              <CustomIcon 
                name="exchange" 
                size={25}
                color={colors.secondaryText}
                style={{ marginLeft: 1, padding: 10 }}
              />
            </TouchableOpacity>
            <CustomText size={'large'} isPrimary >{weather.location.name}</CustomText>
            <TouchableOpacity
              onPress={() => { refreshWeatherData() }}>
              <CustomIcon 
                name="refresh" 
                size={25}
                color={colors.secondaryText}
                style={{ marginLeft: 1, padding: 10 }}
              />
            </TouchableOpacity>
          </View>
          <View style={{alignItems: 'center'}}>
            <CustomText size={'mega'}>{weather.current.temp_c}°</CustomText>
          </View>
          <View style={{flexDirection:'row', justifyContent: 'center', alignItems: 'center', marginBottom: 15}}>
            <CustomText
              size={'small'}
            >
              {weather.current.condition.text}
            </CustomText>
            <Image
              style={styles.tinyLogo}
              source={{uri: weather.current.condition.icon.replace(/^\/\//, "https:")}}
            />
          </View>
          <View style=
            {[
              {backgroundColor: colors.card},
              {borderRadius: 15, marginLeft: 15, marginRight: 15, marginBottom: 15},
              {alignItems: 'center', justifyContent:'space-around', flexDirection: 'row'}]}>
            <View style={{alignItems: 'center', flex:1}}>
              <CustomIcon 
                name="cloud" 
                size={25}
                color={colors.secondaryText}
                style={{ marginLeft: 1, padding: 10 }}
              />
              <CustomText style={{padding: 5}} size={'medium'} isPrimary>{weather.current.wind_kph} km/h</CustomText>
              <CustomText style={{padding: 5}} size={'small'}>Wind</CustomText>
            </View>
            <View style={{alignItems: 'center', flex: 1}}>
              <CustomIcon 
                name="sun-o" 
                size={25}
                color={colors.secondaryText}
                style={{ marginLeft: 1, padding: 10 }}
              />
              <CustomText style={{padding: 5}} size={'medium'} isPrimary>{weather.current.uv}</CustomText>
              <CustomText style={{padding: 5}} size={'small'}>UV</CustomText>
            </View>
            <View style={{alignItems: 'center', flex: 1}}>
              <CustomIcon 
                name="umbrella" 
                size={25}
                color={colors.secondaryText}
                style={{ marginLeft: 1, padding: 10 }}
              />
              <CustomText style={{padding: 5}} size={'medium'} isPrimary>{weather.current.humidity} %</CustomText>
              <CustomText style={{padding: 5}} size={'small'}>Humidity</CustomText>
            </View>
          </View>
          <View style={{flex: 1}}>
            <FlatList
              data={weather.forecast.forecastday}
              keyExtractor={(item) => item.date}
              renderItem={({ item }) => dayWeatherItemList({item})}
            />
          </View>
        </View>
    </SafeAreaView>
  );
}

export default CityWeather;

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
  },
  tinyLogo: {
    width: 30,
    height: 30,
  },
  logo: {
    width: 40,
    height: 40
  }
});
