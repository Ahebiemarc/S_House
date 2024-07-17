import React, { useMemo, useState } from "react";
import { Button, SafeAreaView, Text, TouchableOpacity, View } from "react-native"
import {TabStackScreenProps } from "../../../domain/types/route.types";
import ExploreHeader from "../../components/ExploreHeader.component";
import Listings from "../../components/Listings.component";

import listingsData from '../../assets/data/airbnb-listings.json'
import listingsDataGeo from "../../assets/data/airbnb-listings.geo.json"
import ListingsMaps from "../../components/ListingsMaps.component";
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
            {/*<Listings listings={items} category={category} /> */}
            <ListingsMaps listings={listingsDataGeo} />       
        </SafeAreaView>
    )
}

export default Explore;