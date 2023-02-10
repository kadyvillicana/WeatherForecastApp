import React from 'react'
import { StyleSheet, View } from 'react-native'
import CustomText from './CustomText'

export default function CityItem({city}) {
    return (
        <View style={[{ flexDirection: "column" }, styles.cityNameContainer]}>
            <CustomText size={'medium'} isPrimary>
                {city.name}, {city.region}
            </CustomText>
            <CustomText size={'medium'}>
                {city.country}
            </CustomText>
        </View>
    )
}

const styles = StyleSheet.create({
    cityNameContainer: {
        paddingTop: 10,
        paddingBottom: 10,
        marginLeft: 15,
    },
});