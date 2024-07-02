import React, { useState } from "react";
import { Button, SafeAreaView, Text, TouchableOpacity, View } from "react-native"
import {TabStackScreenProps } from "../../../domain/types/route.types";
import ExploreHeader from "../../components/ExploreHeader.component";
import Listings from "../../components/Listings.component";

type Props = TabStackScreenProps<'Explore'>

const Explore: React.FC<Props> = ({navigation}) => {

    const [category, setCategory] = useState('Tiny homes')

    const onDataChanged = (category :string) => {
        console.log("CHANGE category: " + category);
        setCategory(category);
        
    }

    return(
        <SafeAreaView style={{flex: 1, marginTop: 130,}}>

            <ExploreHeader onCategoryChanged={onDataChanged}  />
            <Listings listings={[]} category={category} />        
        </SafeAreaView>
    )
}

export default Explore;