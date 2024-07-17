import React from "react"
import { StyleSheet, Text, View } from "react-native";
import MapView from "react-native-maps";


interface Props {
    listings: any;
}
const ListingsMaps:React.FC<Props> = ({listings}) =>{
    return(
        <View style={styles.container}>
            <MapView style={styles.map}
                initialRegion={{
                    latitude: 37.78825,
                    longitude: -122.4324,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    map: {
        height: '100%',
        width: '100%',
    },
})

export default ListingsMaps;