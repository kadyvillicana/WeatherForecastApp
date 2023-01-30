import React, { useState, useEffect, useCallback, useContext } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import CustomIcon from './CustomIcon';
import CustomText from './CustomText';
import { MainWeatherContext } from '../context/MainWeatherContext';
import { useTheme } from '@react-navigation/native';
import { getAutocompleteCities } from '../utils/api';
import CustomTextInput from './CustomTextInput';

function SearchCityAutocomplete({}){
  const { colors } = useTheme();
  const [searchText, setSearchText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
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
        setIsLoading(false);
      } catch(error) {
        console.log(error);
      }
    }
    if(debouncedText) {
      setIsLoading(true);
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
        <CustomTextInput
          isPrimary
          style={styles.input}
          placeholderTextColor={colors.secondaryText}
          placeholder='Search for a city or coordinates (lat,lon)'
          value={searchText}
          onChangeText={handleTextChange}
        />
      </View>
      {
        isLoading ? <View style={{flex: 1, justifyContent:'center', alignItems: 'center'}}><ActivityIndicator /></View> : 
          <FlatList
            data={results}
            keyExtractor={(item) => item.id}
            ItemSeparatorComponent={() => (
              <View style={{ backgroundColor: colors.secondaryText, height: 1 }} />
            )}
            renderItem={({ item }) => <CityItem city={item}/>}
          />
      }
      
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