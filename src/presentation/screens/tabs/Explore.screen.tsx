import React, { useMemo, useState } from "react";
import { Button, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import {TabStackScreenProps } from "../../../domain/types/route.types";
import ExploreHeader from "../../components/ExploreHeader.component";
import Listings from "../../components/Listings.component";
import Ionicons from 'react-native-vector-icons/Ionicons';

import Colors from '../../../application/utils/constants/Color'

import listingsData from '../../assets/data/airbnb-listings.json'
import listingsDataGeo from '../../assets/data/airbnb-listings.geo.json'
type Props = TabStackScreenProps<'Explore'>

const Explore: React.FC<Props> = ({navigation}) => {

    const [category, setCategory] = useState('Tiny homes');
    const items = useMemo(() => listingsData as any, []);

    const onDataChanged = (category :string) => {
        console.log("CHANGE category: " + category);
        setCategory(category);
        
    }

    return(
        <SafeAreaView style={{flex: 1, }}>

            <ExploreHeader onCategoryChanged={onDataChanged}  />
            <Listings listings={items} category={category} /> 
            <View style={styles.absoluteView}>
                <TouchableOpacity onPress={() => navigation.navigate('Map', {item: listingsDataGeo as any})} style={styles.btn}>
                <Text style={{ fontFamily: 'Poppins-SemiBold', color: '#fff' }}>Map</Text>
                <Ionicons name="map" size={20} style={{ marginLeft: 10 }} color={'#fff'} />
                </TouchableOpacity>
            </View>       
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    absoluteView: {
        position: 'absolute',
        bottom: 30,
        width: '100%',
        alignItems: 'center',
      },
      btn: {
        backgroundColor: Colors.dark,
        padding: 14,
        height: 50,
        borderRadius: 30,
        flexDirection: 'row',
        marginHorizontal: 'auto',
        alignItems: 'center',
      },
      sheetContainer: {
        backgroundColor: '#fff',
        elevation: 4,
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowRadius: 4,
        shadowOffset: {
          width: 1,
          height: 1,
        },
      }
    
})

export default Explore;