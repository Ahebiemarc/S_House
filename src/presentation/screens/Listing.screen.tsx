import { SafeAreaView, Text, View } from "react-native"
import { RootStackScreenProps } from "../../domain/types/route.types";
import React from "react";

type Props = RootStackScreenProps<'Listing'>

const Listing:React.FC<Props> = ({route}) => {

    const { id } = route.params
    console.log(id);
    
    return(
        <SafeAreaView>
            <Text> {id && id.toString()} Listing</Text>
        </SafeAreaView>
    )
}

export default Listing;