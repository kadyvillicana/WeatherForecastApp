import React, { useState, useEffect, useCallback, useContext } from 'react';
import { View, TextInput, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';
import CustomIcon from './CustomIcon';
import CustomText from './CustomText';
import { MainWeatherContext } from '../context/MainWeatherContext';
import { useTheme } from '@react-navigation/native';
import { getAutocompleteCities } from '../utils/api';

function SearchCityAutocomplete({navigation}){
  const { colors } = useTheme();
  const [searchText, setSearchText] = useState('');
  const [debouncedText, setDebouncedText] = useState('');
  const [results, setResults] = useState([]);

  const { setCity } = useContext(MainWeatherContext);

  const handleTextChange = useCallback((text) => {
    if(!text){
      setResults([]);
    }
    setSearchText(text);
  }, []);

  const clear = () => {
    setResults([]);
    setSearchText('');
    setDebouncedText('');
  }

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedText(searchText);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchText]);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const data = await getAutocompleteCities(debouncedText)
        setResults(data);
      } catch(error) {
        console.log(error);
      }
    }
    if(debouncedText) {
      fetchCities();
    }
  }, [debouncedText]);

  const _setCity = async (city) => {
    if(!city){
      return
    }
    setCity(`${city.lat},${city.lon}`);
    clear();
  }

  const CityItem = ({city}) => (
    <TouchableOpacity onPress={() => _setCity(city)} style={styles.cityNameContainer}>
      <View style={{flexDirection:"column"}}>
        <CustomText size={'medium'} isPrimary>
          {city.name}, {city.region}
        </CustomText>
        <CustomText size={'medium'}>
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