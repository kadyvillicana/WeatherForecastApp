import React, { useState, useEffect, useCallback } from 'react';
import { View, TextInput, FlatList, Text, StyleSheet, TouchableHighlight, TouchableOpacity } from 'react-native';
import axios from 'axios';
import CustomIcon from './CustomIcon';
import CustomText from './CustomText';

function SearchCityAutocomplete(){
  const [searchText, setSearchText] = useState('');
  const [debouncedText, setDebouncedText] = useState('');
  const [results, setResults] = useState([]);
  const API_KEY = '7c33f92506484e488de44806232501';
  const API_ENDPOINT = `https://api.weatherapi.com/v1/search.json?key=${API_KEY}&q=`;

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
      axios.get(API_ENDPOINT + debouncedText)
      .then(response => {
        console.log(response);
        setResults(response.data);
      })
      .catch(error => {
        console.log(JSON.stringify(error));
      })
    }
  }, [debouncedText]);

  const setCity = ({city}) => {
    console.log(city);
  }

  const CityItem = (city) => (
    <TouchableOpacity onPress={() => console.log(city)} style={styles.cityNameContainer}>
      <View style={{flexDirection:"column"}}>
        <CustomText size={'medium'}>
          {name}, {region}
        </CustomText>
        <CustomText size={'medium'}>
          {country}
        </CustomText>
      </View>
    </TouchableOpacity>
  )

  return (
    <View style={{flex:1}}>
      <View style={styles.container}>
        <CustomIcon 
          name="search" 
          size={15}
          color="black"
          style={{ marginLeft: 1 }}
        />
        <TextInput
          style={styles.input}
          placeholder='Search for a city'
          value={searchText}
          onChangeText={handleTextChange}
        />
      </View>
      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <CityItem {...item} />}
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
    backgroundColor: "#d9dbda",
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
    marginBottom: 10,
    marginRight: 15,
  }
});