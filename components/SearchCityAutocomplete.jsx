import React, { useState, useEffect, useCallback } from 'react';
import { View, TextInput, FlatList, Text, StyleSheet } from 'react-native';
import axios from 'axios';
import CustomIcon from './CustomIcon';

function SearchCityAutocomplete(){
  const [searchText, setSearchText] = useState('');
  const [debouncedText, setDebouncedText] = useState('');
  const [results, setResults] = useState([]);
  const API_KEY = '7c33f92506484e488de44806232501';
  const API_ENDPOINT = `https://api.weatherapi.com/v1/search.json?key=${API_KEY}&q=`;

  const handleTextChange = useCallback((text) => {
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
        setResults(response.data);
      })
      .catch(error => {
        console.log(JSON.stringify(error));
      })
    }
  }, [debouncedText]);

  const CityItem = ({cityName}) => (
    <View>
      <Text>
        {cityName}
      </Text>
    </View>
  )

  return (
    <View>
      <View style={styles.container}>
        <CustomIcon 
          name="search" 
          size={20}
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
        renderItem={({ item }) => <CityItem cityName={item.name} />}
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
    fontSize: 20,
    marginLeft: 10,
    width: "90%",
  },
});