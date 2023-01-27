import React from 'react';
import { SafeAreaView, StyleSheet, Text } from 'react-native';
import SearchCityAutocomplete from './components/SearchCityAutocomplete';

function App(){
  return (
    <SafeAreaView style={styles.container}>
      <SearchCityAutocomplete/>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    },
  });

export default App;
