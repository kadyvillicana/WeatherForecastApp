import { useTheme } from '@react-navigation/native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, Keyboard, KeyboardAvoidingView, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { shallow } from 'zustand/shallow';
import { useWeatherStore } from '../store';
import { getAutocompleteCities } from '../utils/api';
import CityItem from './CityItem';
import CustomIcon from './CustomIcon';
import CustomText from './CustomText';
import CustomTextInput from './CustomTextInput';
import SearchCityAutocomplete from './SearchCityAutocomplete';

function Home() {
  const { colors } = useTheme();
  const [hideComponents, setHideComponents] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [debouncedText, setDebouncedText] = useState('');
  const [results, setResults] = useState([]);

  const { cities, getCities, setCitySelected } = useWeatherStore((state) =>
  ({
    cities: state.cities,
    getCities: state.getCities,
    setCitySelected: state.setCitySelected,
  }), shallow);

  const handleTextChange = useCallback((text) => {
    if (!text) {
      setResults([]);
    }
    setSearchText(text);
  }, []);

  const clear = () => {
    setResults([]);
    setSearchText('');
    setDebouncedText('');
  }

  const setCity = async (city) => {
    if (!city) {
      return
    }
    await setCitySelected(city)
    clear();
  }

  useEffect(() => {
    getCities();
  }, [])

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const data = await getAutocompleteCities(debouncedText)
        setResults(data);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    }
    if (debouncedText) {
      setIsLoading(true);
      fetchCities();
    }
  }, [debouncedText]);

  useEffect(() => {
    toogleComponents(searchText !== '')
    const timeoutId = setTimeout(() => {
      setDebouncedText(searchText);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchText]);

  function toogleComponents(value){
    setHideComponents(value);
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView>
        <TouchableWithoutFeedback>
          <View>
            <CustomText size={'large'} isPrimary 
              style={
                {
                  paddingLeft: 20,
                  display: (hideComponents ? 'none': 'flex'),
                }}>
              Weather
            </CustomText>
            <View style={[styles.container, { backgroundColor: colors.card }]}>
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
                placeholder='Search for a city'
                value={searchText}
                onChangeText={handleTextChange}
              />
            </View>
            <FlatList
              style={{display: (hideComponents ? 'none': 'flex')}}
              data={cities}
              keyExtractor={(item) => item.name}
              renderItem={({item}) => 
              <TouchableOpacity onPress={() => setCity(item)}>
                <CityItem city={item} />
              </TouchableOpacity>
            }
            />
            {
              isLoading ? 
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator />
              </View> 
              :
              <FlatList
                style={{display: (results.length > 0 ? 'flex': 'none')}}
                data={results}
                keyExtractor={(item) => item.id}
                ItemSeparatorComponent={() => (
                  <View style={{ backgroundColor: colors.secondaryText, height: 1 }} />
                )}
                renderItem={({ item }) => 
                <TouchableOpacity onPress={() => setCity(item)}>
                  <CityItem city={item} />
                </TouchableOpacity> 
                }
              />
            }
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default Home;

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
  },
});
