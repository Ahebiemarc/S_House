// --- Fichier: MapScreen.tsx ---
// Écran affichant une carte pour sélectionner la localisation (TypeScript)
// (Aucun changement nécessaire dans ce fichier)

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, Alert } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Region, MapPressEvent, MarkerDragStartEndEvent } from 'react-native-maps';
import { Button, ActivityIndicator, Text } from 'react-native-paper';
import { StackScreenProps } from '@react-navigation/stack';
import { usePostData } from '../../application/providers/PostContext';
import { RootStackParamList } from '../../domain/types/route.types';
import ProtectedRoute from '../../application/routes/Protected.route';

type MapScreenProps = StackScreenProps<RootStackParamList, 'MapAddPost'>;

interface Coordinates {
    latitude: number;
    longitude: number;
}

const MapAddPost: React.FC<MapScreenProps> = ({ navigation, route }) => {
  //const { postData, setCoordinates } = usePostData();
  const { postId } = route.params || {}; // postId est disponible ici si passé
  const { postData, setCoordinates, updatePostData: updateContextPostData, currentEditingPostId } = usePostData();
  const [mapRegion, setMapRegion] = useState<Region | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<Coordinates | null>(
      postData.latitude !== null && postData.longitude !== null
          ? { latitude: postData.latitude, longitude: postData.longitude }
          : null
  );
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Si on est en mode édition et que postData a des coordonnées, les utiliser
    // Sinon, utiliser la localisation par défaut ou celle de postData si création en cours
    const lat = (currentEditingPostId && postData.latitude) ? postData.latitude : (postData.latitude ?? 35.1615);
    const lon = (currentEditingPostId && postData.longitude) ? postData.longitude : (postData.longitude ?? 9.7658);

    const initialRegion: Region = {
        latitude: lat,
        longitude: lon,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    };
    setMapRegion(initialRegion);
    // Si des coordonnées sont déjà dans postData (ex: chargées pour édition), pré-sélectionner le marqueur
    if (postData.latitude && postData.longitude) {
        setSelectedLocation({latitude: postData.latitude, longitude: postData.longitude});
    }
    setLoading(false);
  }, [currentEditingPostId, postData.latitude, postData.longitude]); // Dépendre de postData pour re-centrer si chargé pour édition


  const handleMapPress = (event: MapPressEvent): void => {
    setSelectedLocation(event.nativeEvent.coordinate);
  };

   const handleMarkerDragEnd = (event: MarkerDragStartEndEvent): void => {
    setSelectedLocation(event.nativeEvent.coordinate);
   };

  const handleConfirmLocation = (): void => {
    if (selectedLocation) {
      setCoordinates(selectedLocation);
      navigation.goBack();
    } else {
      Alert.alert("Sélection requise", "Veuillez sélectionner une localisation sur la carte.");
    }
  };

  if (loading || !mapRegion) {
    return (
      <View style={styles_map.centered}>
        <ActivityIndicator animating={true} size="large" />
        <Text style={styles_map.loadingText}>Chargement de la carte...</Text>
      </View>
    );
  }

  return (
    <View style={styles_map.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles_map.map}
        initialRegion={mapRegion}
        onPress={handleMapPress}
        showsUserLocation={true}
        showsMyLocationButton={true}
      >
        {selectedLocation && (
          <Marker
            coordinate={selectedLocation}
            title="Localisation Sélectionnée"
            description="C'est ici que se trouve la propriété"
            draggable
            onDragEnd={handleMarkerDragEnd}
          />
        )}
      </MapView>
      <Button
        mode="contained"
        onPress={handleConfirmLocation}
        style={styles_map.confirmButton}
        disabled={!selectedLocation}
        labelStyle={styles_map.buttonLabel}
      >
        Confirmer la Localisation
      </Button>
    </View>
  );
};

// Styles pour l'écran MapScreen (renommés pour éviter conflit)
const { width, height } = Dimensions.get('window');
const styles_map = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  confirmButton: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    paddingVertical: 8,
    borderRadius: 25,
  },
  buttonLabel: {
      fontSize: 16,
      fontWeight: 'bold',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
      marginTop: 10,
      fontSize: 16,
  }
});

//export default MapAddPost;

export default function ProtectedMapAddPost(props: MapScreenProps) {
    return (
      <ProtectedRoute>
        <MapAddPost {...props} />
      </ProtectedRoute>
    );
}