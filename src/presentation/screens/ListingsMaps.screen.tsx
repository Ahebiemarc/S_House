import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, PermissionsAndroid, Platform, StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { Marker, PROVIDER_GOOGLE, Region } from "react-native-maps";
import { defaultStyles } from "../../application/utils/constants/Styles";
import Geolocation from "@react-native-community/geolocation";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../domain/types/route.types";
import { useNavigation } from "@react-navigation/native";
import MapView from "react-native-map-clustering";
import listingsDataGeo from '../assets/data/airbnb-listings.geo.json'
import ApartmentItem from "../components/ApartmentItem.component";



interface Props {
    listings: any;
}

type ExploreHeaderNavigationProp = StackNavigationProp<RootStackParamList, 'Tab'>;

const defaultLocation = {
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
};


const INITIAL_REGION = {
    latitude: 52.52, // Latitude pour Berlin
    longitude: 13.405, // Longitude pour Berlin
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };
  
const ListingsMaps = () => {

    const [location, setLocation] = useState<Region>();
    const [loading, setLoading] = useState(true);

    const [selectedApartment, setSelectedApartment] = useState(null);


    const navigation = useNavigation<ExploreHeaderNavigationProp>();
    const listings: any = listingsDataGeo;
    

    // Vérifiez si features est un tableau
    if (!listings.features || !Array.isArray(listings.features)) {
      console.error('Le fichier JSON ne contient pas un tableau de features.');
      return null; // Ou gérez l'erreur comme il convient
    }




    const onMarkerSelected = ( item: any) => {
        navigation.navigate('Listing', {item: item.properties});
    }
    
      const getCurrentLocation = () => {
        Geolocation.getCurrentPosition(
          position => {
            setLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            });
            setLoading(false);
          },
          error => {
            Alert.alert(
              'Error',
              `Failed to get your location: ${error.message}` +
                ' Make sure your location is enabled.',
            );
            setLocation(defaultLocation);
            setLoading(false);
          }
        );
      };
    
      useEffect(() => {
        const requestLocationPermission = async () => {
          if (Platform.OS === 'android') {
            try {
              const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
              );
              if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                getCurrentLocation();
              } else {
                Alert.alert(
                  'Permission Denied',
                  'Location permission is required to show your current location on the map.',
                );
                setLocation(defaultLocation);
                setLoading(false);
              }
            } catch (err) {
              console.warn(err);
              setLocation(defaultLocation);
              setLoading(false);
            }
          } else {
            getCurrentLocation();
          }
        };
    
        requestLocationPermission();
      }, []);


    const renderCluster =( cluster: any) =>{
      const { id, geometry, onPress, properties } = cluster;

      const points = properties.point_count;
      return (
        <Marker
          key={`cluster-${id}`}
          coordinate={{
            longitude: geometry.coordinates[0],
            latitude: geometry.coordinates[1],
          }}
          onPress={onPress}>
          <View style={styles.marker}>
            <Text
              style={{
                color: '#000',
                textAlign: 'center',
                fontFamily: 'Poppins-SemiBold',
              }}>
              {points}
            </Text>
          </View>
        </Marker>
      );
    }
    return (
        <View style={[defaultStyles.container,]}>
            {loading  ? (
                <ActivityIndicator size="large" color="#0000ff" />

            ) :
            (
                <MapView
                animationEnabled={false} 
                style={StyleSheet.absoluteFillObject}
                provider={PROVIDER_GOOGLE}
                region={INITIAL_REGION}
                showsUserLocation={true}
                showsMyLocationButton={true}
                zoomEnabled={true}  // Permet le zoom
                //scrollEnabled={true}  // Permet le panning
                //pitchEnabled={true}  // Permet de changer l'angle de vue
                //rotateEnabled={true}
                clusterColor="rgba(255, 56, 92, 0.7)" 
                clusterTextColor="#fff"
                clusterFontFamily="Popins-Bold"
                renderCluster={renderCluster}
            >
                {listings.features.map((item:any) => (
                    <Marker 
                      key={item.properties.id}
                      //onPress={() => onMarkerSelected(item)}
                      onPress={() => setSelectedApartment(item)}
                      coordinate={{
                        latitude: +item.properties.latitude,
                        longitude: +item.properties.longitude,
                    }} >
                      <View style={styles.marker}>
                        <Text style={styles.markerText}>DT {item.properties.price}</Text>
                      </View>
                    </Marker>
                ))}
            </MapView>
            )
        }
        {/* display seleted Apartment */}
        { selectedApartment && 
          <ApartmentItem Onpress={() => onMarkerSelected(selectedApartment)} listing={selectedApartment} containerStyle={{
          position: 'absolute',
          bottom: 70,
          padding: 10,
          right: 10,
          left: 10,
        }} />
        }
       
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    marker: {
      padding: 8,
      paddingHorizontal: 15,
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

export default ListingsMaps;
