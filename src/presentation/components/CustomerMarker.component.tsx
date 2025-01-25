import { StyleSheet, Text } from "react-native";
import { View } from "react-native";
import { Marker } from "react-native-maps";

type Props ={
    listing: any;
    Onpress: (item: any) => void;
}

const CustomerMarker: React.FC<Props> = ({listing, Onpress}) =>{
    return(
        <View>
                    <Marker
                      key={listing.properties.id}
                      onPress={() => Onpress(listing)}
                      coordinate={{
                        latitude: +listing.properties.latitude,
                        longitude: +listing.properties.longitude,
                    }} >
                      <View style={styles.marker}>
                        <Text style={styles.markerText}>DT {listing.properties.price}</Text>
                      </View>
                    </Marker>
                    
        </View>
    )
};

const styles = StyleSheet.create({
    marker: {
        padding: 8,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        color: "#fff",
        elevation: 5,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#fff',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 6,
        shadowOffset: {
          width: 1,
          height: 10,
        },
      },
      markerText: {
        fontSize: 14,
        fontFamily: 'Poppins-Bold',
        color: '#000',
        textAlign: 'center',
      },
});

export default CustomerMarker;