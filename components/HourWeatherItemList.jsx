import moment from 'moment';
import React from 'react'
import { View, Image } from 'react-native';
import CustomText from './CustomText';
import CustomImage from './CustomImage';

// HourWeatherItemList component to display an item for hourly weather data
// with weather condition icon, time, weather condition text and temperature
function HourWeatherItemList({item}) {
  const time = moment(item.time);
  return (
    <View style={{alignItems: 'center', justifyContent:'space-around', flexDirection: 'row', margin: 15}}>
      <View style={{flex: 1}}>
        <CustomImage
          size='regular'
          source={{uri: item.condition.icon.replace(/^\/\//, "https:")}}
        />
      </View>
      <View style={{flex: 3, justifyContent:'flex-start'}}>
        <CustomText size={'medium'} isPrimary>{time.format('hh a')}</CustomText>
        <CustomText style={{paddingTop: 5}}>{item.condition.text}</CustomText>
      </View>
      <View style={{flex: 2, flexDirection: 'row', justifyContent:'flex-end'}}>
        <CustomText size={'medium'}>{item.temp_c} °</CustomText>
      </View>
    </View>
  )
}

export default HourWeatherItemList;
