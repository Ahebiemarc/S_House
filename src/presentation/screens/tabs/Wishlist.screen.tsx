import { SafeAreaView, Text, View } from "react-native"
import ApartmentListItems from "../../components/AppartmentListItems.component";
import { useMemo } from "react";


import listingsData from '../../assets/data/airbnb-listings.json';


const Wishlist = () => {

    const items = useMemo(() => listingsData as any, []);    

    return(
        <SafeAreaView>
            <ApartmentListItems listings={items} />
        </SafeAreaView>
    )
}

export default Wishlist;