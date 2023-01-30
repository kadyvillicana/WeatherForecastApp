import { useTheme } from '@react-navigation/native';
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { FlatList, Image, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import CustomIcon from './CustomIcon';
import CustomText from './CustomText';
import moment from "moment";
import { MainWeatherContext } from '../context/MainWeatherContext';
import { getCityWeather } from '../utils/api';


function WeatherCityModal({route, navigation}) {
  const { colors } = useTheme();
  const { state } = useContext(MainWeatherContext);
  const coordinates = state.city;
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const data = await getCityWeather(coordinates);
        setWeather(data);
      } catch (error) {
        console.log(error);
      }
    };

    if (coordinates) {
      fetchWeatherData();
    }
  }, [coordinates]);

  const dayWeatherItemList = ({item}) => {
    const date = moment(item.date);
    const isToday = moment().isSame(date, 'day');
    return (
      <View style={{alignItems: 'center', justifyContent:'space-around', flexDirection: 'row', margin: 15}}>
        <View style={{flex: 1}}>
          <Image
            style={styles.tinyLogo}
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
    )

  }

  return (
    <SafeAreaView style={{flex: 1, marginTop: 15}}>
      {
        weather !== null ? 
        <View style={{flex: 1}}>
          <View style={{alignItems: 'center'}}>
            <CustomText size={'large'} isPrimary >{weather.location.name}</CustomText>
          </View>
          <View style={{alignItems: 'center'}}>
            <CustomText size={'mega'}>{weather.current.temp_c}°</CustomText>
          </View>
          <View style={{flexDirection:'row', justifyContent: 'center', alignItems: 'center'}}>
            <CustomText
              size={'medium'}
            >{weather.current.condition.text}</CustomText>
            <Image
              style={styles.tinyLogo}
              source={{uri: weather.current.condition.icon.replace(/^\/\//, "https:")}}
            />
          </View>
          <View style=
            {[
              {backgroundColor: colors.card},
              {borderRadius: 15, marginLeft: 15, marginRight: 15},
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
              // ItemSeparatorComponent={() => (
              //   <View style={{ backgroundColor: colors.secondaryText, height: 1 }} />
              // )}
              renderItem={({ item }) => dayWeatherItemList({item})}
            />
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
