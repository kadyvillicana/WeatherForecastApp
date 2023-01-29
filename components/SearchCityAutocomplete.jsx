import React, { useState, useEffect, useCallback, useContext } from 'react';
import { View, TextInput, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';
import CustomIcon from './CustomIcon';
import CustomText from './CustomText';
import { MainWeatherContext } from '../context/MainWeatherContext';
import { useTheme } from '@react-navigation/native';

function SearchCityAutocomplete({navigation}){
  const { colors } = useTheme();
  const [searchText, setSearchText] = useState('');
  const [debouncedText, setDebouncedText] = useState('');
  const [results, setResults] = useState([]);
  const API_KEY = '7c33f92506484e488de44806232501';
  const API_ENDPOINT_SEARCH = `https://api.weatherapi.com/v1/search.json?key=${API_KEY}&q=`;

  const { setCity } = useContext(MainWeatherContext);

  const handleTextChange = useCallback((text) => {
    if(!text){
      setResults([]);
    }
    setSearchText(text);
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedText(searchText);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchText]);

  useEffect(() => {
    if(debouncedText) {
      axios.get(API_ENDPOINT_SEARCH + debouncedText)
      .then(response => {
        setResults(response.data);
      })
      .catch(error => {
        console.log(JSON.stringify(error));
      })
    }
  }, [debouncedText]);

  const _setCity = async (city) => {
    if(!city){
      return
    }
    setCity(city);
    navigation.navigate('WeatherCityModal', {coordinates: `${city.lat},${city.lon}` });
  }

  const CityItem = ({city}) => (
    <TouchableOpacity onPress={() => _setCity(city)} style={styles.cityNameContainer}>
      <View style={{flexDirection:"column"}}>
        <CustomText size={'small'} isPrimary>
          {city.name}, {city.region}
        </CustomText>
        <CustomText size={'small'}>
          {city.country}
        </CustomText>
      </View>
    </TouchableOpacity>
  )

  return (
    <View style={{flex:1, marginTop: 30}}>
      <View style={[styles.container, {backgroundColor: colors.card}]}>
        <CustomIcon 
          name="search" 
          size={15}
          color={colors.secondaryText}
          style={{ marginLeft: 1 }}
        />
        <TextInput
          isPrimary
          style={[styles.input, {color: colors.text}]}
          placeholderTextColor={colors.secondaryText}
          placeholder='Search for a city'
          value={searchText}
          onChangeText={handleTextChange}
        />
      </View>
      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => (
          <View style={{ backgroundColor: colors.secondaryText, height: 1 }} />
        )}
        renderItem={({ item }) => <CityItem city={item}/>}
      />
    </View>
  );
}

export default SearchCityAutocomplete;

const styles = StyleSheet.create({
  container: {
    margin: 15,
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "row",
    padding: 10,
    width: "90%",
    borderRadius: 15,
  },
  input: {
    fontSize: 15,
    marginLeft: 10,
    width: "90%",
  },
  cityNameContainer: {
    paddingTop: 10,
    paddingBottom: 10,
    marginLeft: 15,
  }
});