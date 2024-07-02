import React, { useEffect } from "react";
import { View } from "react-native"

interface Props {
    listings: any[];
    category: string;
}

const Listings: React.FC<Props> = ({listings, category}) => {

    useEffect(() => {
        console.log("Reloading Listings");
        
    }, [category])
    return(
        <View></View>
    )
}

export default Listings;