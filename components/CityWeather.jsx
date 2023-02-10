import { useTheme } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { ActivityIndicator, FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import CustomIcon from './CustomIcon';
import CustomText from './CustomText';
import moment from "moment";
import CustomImage from './CustomImage';
import { useWeatherStore } from '../store';
import {shallow} from "zustand/shallow";

function CityWeather({navigation}) {
  const { citySelected, getWeatherByCity, cityWeather, isLoading, removeCitySelected } = useWeatherStore((state) => 
  ({
    citySelected: state.citySelected,
    getWeatherByCity: state.getWeatherByCity,
    cityWeather: state.cityWeather,
    isLoading: state.isLoading,
    removeCitySelected: state.removeCitySelected,
  }), shallow);


  const { colors } = useTheme();

  const coordinates = `${citySelected.lat},${citySelected.lon}`;

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        await getWeatherByCity(coordinates, false);
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
        await getWeatherByCity(coordinates, true);
      } catch (error) {
        console.log(error);
      }
    };
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
            <CustomImage
              size='regular'
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
              onPress={() => { removeCitySelected() }}>
              <CustomIcon 
                name="exchange" 
                size={25}
                color={colors.secondaryText}
                style={{ marginLeft: 1, padding: 10 }}
              />
            </TouchableOpacity>
            <CustomText size={'large'} isPrimary >{cityWeather.location.name}</CustomText>
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
            <CustomText size={'mega'}>{cityWeather.current.temp_c}°</CustomText>
          </View>
          <View style={{flexDirection:'row', justifyContent: 'center', alignItems: 'center', marginBottom: 15}}>
            <CustomText
              size={'small'}
            >
              {cityWeather.current.condition.text}
            </CustomText>
            <CustomImage
              size='tiny'
              source={{uri: cityWeather.current.condition.icon.replace(/^\/\//, "https:")}}
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
              <CustomText style={{padding: 5}} size={'medium'} isPrimary>{cityWeather.current.wind_kph} km/h</CustomText>
              <CustomText style={{padding: 5}} size={'small'}>Wind</CustomText>
            </View>
            <View style={{alignItems: 'center', flex: 1}}>
              <CustomIcon 
                name="sun-o" 
                size={25}
                color={colors.secondaryText}
                style={{ marginLeft: 1, padding: 10 }}
              />
              <CustomText style={{padding: 5}} size={'medium'} isPrimary>{cityWeather.current.uv}</CustomText>
              <CustomText style={{padding: 5}} size={'small'}>UV</CustomText>
            </View>
            <View style={{alignItems: 'center', flex: 1}}>
              <CustomIcon 
                name="umbrella" 
                size={25}
                color={colors.secondaryText}
                style={{ marginLeft: 1, padding: 10 }}
              />
              <CustomText style={{padding: 5}} size={'medium'} isPrimary>{cityWeather.current.humidity} %</CustomText>
              <CustomText style={{padding: 5}} size={'small'}>Humidity</CustomText>
            </View>
          </View>
          <View style={{flex: 1}}>
            <FlatList
              data={cityWeather.forecast.forecastday}
              keyExtractor={(item) => item.date}
              renderItem={({ item }) => dayWeatherItemList({item})}
            />
          </View>
        </View>
    </SafeAreaView>
  );
}

export default CityWeather;