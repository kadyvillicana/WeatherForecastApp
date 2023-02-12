import { useTheme } from '@react-navigation/native';
import moment from 'moment';
import React, { createRef, useEffect } from 'react';
import { ActivityIndicator, Dimensions, FlatList, TouchableOpacity, View } from 'react-native';
import { useWeatherStore } from '../store';
import CustomIcon from './CustomIcon';
import CustomText from './CustomText';
import HourWeatherItemList from './HourWeatherItemList';

const ITEM_HEIGHT = 50;

function DayWeatherModal({ route, navigation }) {
  const { colors } = useTheme();
  const { day } = route.params;
  const flatListRef = createRef(); 

  const { weatherByDay, getWeatherByDay, isLoading } = useWeatherStore((state) => ({
    weatherByDay: state.weatherByDay,
    getWeatherByDay: state.getWeatherByDay,
    isLoading: state.isLoading
  }));

  const scrollToIndex = (index, animated) => {
    if (flatListRef) {
      flatListRef.current && flatListRef.current.scrollToIndex({ index, animated });
    }
  };

  const getItemLayout = (data, index) => {
    return { length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index };
  };

  // Fetch the weather data for the day when the component is mounted
  useEffect(() => {
    getWeatherByDay(day);
  }, [])
  
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const d = new Date();
      let hour = d.getHours();
      scrollToIndex(hour, true);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [weatherByDay]);

  if (isLoading) {
    return (
      <View>
        <ActivityIndicator />
      </View>
    )
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={{ alignItems: 'center', margin: 15, flexDirection: 'row' }}>
        <TouchableOpacity
          onPress={() => { navigation.goBack(); }}>
          <CustomIcon
            name="arrow-left"
            size={25}
            color={colors.secondaryText}
            style={{ marginLeft: 1, padding: 10 }}
          />
        </TouchableOpacity>
        <CustomText size={'large'} isPrimary >{moment(day).format('dddd')}</CustomText>
      </View>
      <View style=
        {[
          { backgroundColor: colors.card },
          { borderRadius: 15, marginLeft: 15, marginRight: 15, marginBottom: 15 },
          { alignItems: 'center', justifyContent: 'space-around', flexDirection: 'row' }]}>
        <View style={{ alignItems: 'center', flex: 1 }}>
          <CustomIcon
            name="arrow-down"
            size={25}
            color={colors.secondaryText}
            style={{ marginLeft: 1, padding: 10 }}
          />
          <CustomText style={{ padding: 5 }} size={'medium'} isPrimary>{weatherByDay.day.mintemp_c}°</CustomText>
          <CustomText style={{ padding: 5 }} size={'small'}>Min Temp</CustomText>
        </View>
        <View style={{ alignItems: 'center', flex: 1 }}>
          <CustomIcon
            name="arrow-up"
            size={25}
            color={colors.secondaryText}
            style={{ marginLeft: 1, padding: 10 }}
          />
          <CustomText style={{ padding: 5 }} size={'medium'} isPrimary>{weatherByDay.day.maxtemp_c}°</CustomText>
          <CustomText style={{ padding: 5 }} size={'small'}>Max Temp</CustomText>
        </View>
        <View style={{ alignItems: 'center', flex: 1 }}>
          <CustomIcon
            name="sun-o"
            size={25}
            color={colors.secondaryText}
            style={{ marginLeft: 1, padding: 10 }}
          />
          <CustomText style={{ padding: 5 }} size={'medium'} isPrimary>{weatherByDay.day.uv}</CustomText>
          <CustomText style={{ padding: 5 }} size={'small'}>UV</CustomText>
        </View>
      </View>
      <FlatList
        data={weatherByDay.hour}
        ref={flatListRef}
        keyExtractor={(item) => item.time}
        renderItem={({ item }) => HourWeatherItemList({ item })}
        getItemLayout={getItemLayout}
      />
    </View>
  )
}

export default DayWeatherModal;
