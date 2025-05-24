// Écran pour saisir l'adresse et naviguer vers la carte (TypeScript)
// (Aucun changement direct nécessaire ici, mais handleSubmit inclut maintenant les images)

import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { TextInput, Button, Card, Title, Text, Paragraph } from 'react-native-paper';
import { StackScreenProps } from '@react-navigation/stack';
import { ImageFile, usePostData } from '../../application/hooks/usePost';
import { RootStackParamList } from '../../domain/types/route.types';
import ProtectedRoute from '../../application/routes/Protected.route';

type LocationScreenProps = StackScreenProps<RootStackParamList, 'LocationAddPost'>;


const LocationAddPost: React.FC<LocationScreenProps> = ({ navigation, route }) => {
  //const { postData, updatePostData, addPost, clearPostData } = usePostData();
  const { postId } = route.params || {}; // Récupérer postId
  const { postData, updatePostData, addPost, updatePost, loading, error, clearPostData, currentEditingPostId } = usePostData();


  // Mettre à jour le titre de l'écran en fonction du mode
  useEffect(() => {
    navigation.setOptions({
      title: currentEditingPostId ? 'Modifier Localisation' : 'Nouvelle Localisation',
    });
  }, [navigation, currentEditingPostId]);


  const handleGoToMap = (): void => {
    // Passer postId pour que MapScreen sache aussi s'il est en mode édition (si nécessaire)
    navigation.navigate('MapAddPost', { postId: currentEditingPostId || undefined });
  };

  // Gérer la soumission finale
  const handleSubmit = async (): Promise<void> => {
    if (postData.latitude === null || postData.longitude === null) {
      Alert.alert("Localisation requise", "Veuillez définir la localisation sur la carte.");
      return;
    }

    try {
      let result;
      if (currentEditingPostId) { // Si on est en mode édition (l'ID est dans le contexte)
        result = await updatePost(currentEditingPostId);
        Alert.alert('Succès', 'Propriété mise à jour avec succès !');
      } else {
        result = await addPost();
        Alert.alert('Succès', 'Propriété ajoutée avec succès !');
      }
      console.log('Résultat soumission:', result);
      clearPostData();
      navigation.popToTop(); 
        // ou navigation.navigate('Home'); // par exemple
      } catch (apiError: any) {
        console.error("Erreur lors de l'ajout de la propriété:", apiError);
        Alert.alert(
          'Erreur',
          'Une erreur est survenue lors de l\'ajout de la propriété. Veuillez réessayer.'
        );
        //Alert.alert('Erreur de soumission', error || apiError.message || 'Une erreur est survenue.');
      }
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>Adresse de la Propriété</Title>
          {/* Ensure you have all necessary fields like title, price, description etc.
              before this address part, or integrate them here if this is the final step.
              The current code only shows address and city inputs.
              For a complete "add post" form, you'd typically have inputs for:
              - title
              - description
              - price
              - bedrooms
              - bathrooms
              - type
              - property
              - images (handled by a separate image picker component usually)
          */}
          <TextInput
            label="Adresse complète"
            value={postData.address}
            onChangeText={(text: string) => updatePostData('address', text)}
            mode="outlined"
            style={styles.input}
            disabled={loading}
          />
          <TextInput
            label="Ville"
            value={postData.city}
            onChangeText={(text: string) => updatePostData('city', text)}
            mode="outlined"
            style={styles.input}
            disabled={loading}
          />
          {postData.latitude !== null && postData.longitude !== null && (
            <View style={styles.coordsContainer}>
              <Paragraph style={styles.coordsText}>
                Coordonnées sélectionnées :
              </Paragraph>
              <Text style={styles.coordsValue}>
                Lat: {postData.latitude.toFixed(6)}, Lon: {postData.longitude.toFixed(6)}
              </Text>
            </View>
          )}
          <Button
            icon="map-marker"
            mode="outlined"
            onPress={handleGoToMap}
            style={styles.mapButton}
            disabled={loading}
          >
            {postData.latitude !== null ? 'Modifier sur la carte' : 'Définir sur la carte'}
          </Button>
        </Card.Content>
      </Card>
      <Button
        mode="contained"
        onPress={handleSubmit}
        style={styles.submitButton}
        labelStyle={styles.buttonLabel}
        disabled={loading || postData.latitude === null || postData.longitude === null}
        loading={loading} // Affiche l'ActivityIndicator de react-native-paper
      >
        {/*{loading ? 'Ajout en cours...' : 'Ajouter la Propriété'}*/}
        {loading ? (currentEditingPostId ? "Mise à jour..." : "Ajout en cours...") : (currentEditingPostId ? "Mettre à Jour" : "Ajouter la Propriété")}
      </Button>
    </ScrollView>
  );
};

// Styles pour l'écran LocationScreen (inchangés, mais vous pouvez ajouter un style pour le loader si besoin)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#f5f5f5',
  },
  card: {
    marginBottom: 15,
    borderRadius: 8,
  },
  title: {
    marginBottom: 15,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  mapButton: {
    marginTop: 10,
    marginBottom: 20,
    borderColor: '#6200ee',
  },
  coordsContainer: {
    marginTop: 10,
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    alignItems: 'center',
  },
  coordsText: {
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  coordsValue: {
    color: '#555',
  },
  submitButton: {
    marginTop: 10,
    paddingVertical: 8,
    borderRadius: 25,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  }
});

export default function ProtectedLocationAddPost(props: LocationScreenProps) {
  return (
    <ProtectedRoute>
      <LocationAddPost {...props} />
    </ProtectedRoute>
  );
}
