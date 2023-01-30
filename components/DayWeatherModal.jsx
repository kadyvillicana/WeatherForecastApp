import { useTheme } from '@react-navigation/native';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, StyleSheet, View } from 'react-native';
import { getDayWeather } from '../utils/api';
import CustomIcon from './CustomIcon';
import CustomText from './CustomText';

function DayWeatherModal({route}) {
	const {colors} = useTheme();
	const {day} = route.params;
	const [weather, setWeather] = useState(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
			const fetchDayWeather = async () => {
				try {
					const data = await getDayWeather(day);
					setWeather(data);
					setIsLoading(false);
				} catch (error) {
					console.log(error);
				}
			}

			if(day) {
				fetchDayWeather();
			}
	}, [day])

	if(isLoading) {
		return (
			<View>
				<ActivityIndicator />
			</View>
		)
	}

	const hourWeatherItemList = ({item}) => {
		const time = moment(item.time);
		return (
			<View style={{alignItems: 'center', justifyContent:'space-around', flexDirection: 'row', margin: 15}}>
				<View style={{flex: 1}}>
					<Image
						style={styles.logo}
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

  return (
    <View style={{flex: 1}}>
			<View style={{alignItems: 'center', margin: 15}}>
				<CustomText size={'large'} isPrimary >{moment(day).format('dddd')}</CustomText>
			</View>
			<View style=
            {[
              {backgroundColor: colors.card},
              {borderRadius: 15, marginLeft: 15, marginRight: 15, marginBottom: 15},
              {alignItems: 'center', justifyContent:'space-around', flexDirection: 'row'}]}>
            <View style={{alignItems: 'center', flex: 1}}>
              <CustomIcon 
                name="arrow-down" 
                size={25}
                color={colors.secondaryText}
                style={{ marginLeft: 1, padding: 10 }}
              />
              <CustomText style={{padding: 5}} size={'medium'} isPrimary>{weather.day.mintemp_c}°</CustomText>
              <CustomText style={{padding: 5}} size={'small'}>Min Temp</CustomText>
            </View>
            <View style={{alignItems: 'center', flex:1}}>
              <CustomIcon 
                name="arrow-up" 
                size={25}
                color={colors.secondaryText}
                style={{ marginLeft: 1, padding: 10 }}
              />
              <CustomText style={{padding: 5}} size={'medium'} isPrimary>{weather.day.maxtemp_c}°</CustomText>
              <CustomText style={{padding: 5}} size={'small'}>Max Temp</CustomText>
            </View>
            <View style={{alignItems: 'center', flex: 1}}>
              <CustomIcon 
                name="sun-o" 
                size={25}
                color={colors.secondaryText}
                style={{ marginLeft: 1, padding: 10 }}
              />
              <CustomText style={{padding: 5}} size={'medium'} isPrimary>{weather.day.uv}</CustomText>
              <CustomText style={{padding: 5}} size={'small'}>UV</CustomText>
            </View>
          </View>
      <FlatList 
				data={weather.hour}
				keyExtractor={(item) => item.time}
				renderItem={({item}) => hourWeatherItemList({item})}
			/>
    </View>
  )
}

export default DayWeatherModal;

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

