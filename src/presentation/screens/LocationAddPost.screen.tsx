// Écran pour saisir l'adresse et naviguer vers la carte (TypeScript)
// (Aucun changement direct nécessaire ici, mais handleSubmit inclut maintenant les images)

import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { TextInput, Button, Card, Title, Text, Paragraph } from 'react-native-paper';
import { StackScreenProps } from '@react-navigation/stack';
import { ImageFile, usePostData } from '../../application/hooks/PostContext';
import { RootStackParamList } from '../../domain/types/route.types';
import ProtectedRoute from '../../application/routes/Protected.route';

type LocationScreenProps = StackScreenProps<RootStackParamList, 'LocationAddPost'>;


const LocationAddPost: React.FC<LocationScreenProps> = ({ navigation }) => {
  const { postData, updatePostData, addPost, clearPostData } = usePostData();
  const [isLoading, setIsLoading] = useState(false);

  const handleGoToMap = (): void => {
    navigation.navigate('MapAddPost');
  };

  // Gérer la soumission finale
  const handleSubmit = async (): Promise<void> => {
    // Validate that latitude and longitude are set
    if (postData.latitude === null || postData.longitude === null) {
      Alert.alert('Erreur', 'Veuillez définir la localisation sur la carte.');
      return;
    }

    // Validate other required fields if necessary
    if (!postData.address || !postData.city || !postData.title || !postData.price /* add other checks */) {
        Alert.alert('Champs Requis', 'Veuillez remplir tous les champs obligatoires (adresse, ville, titre, prix, etc.).');
        return;
    }

    setIsLoading(true);
    try {
      // Convertir les URIs d'images de postData.images en structure ImageFile[]
      // PostService.add attend des objets ImageFile pour le téléchargement.
      const imageFilesToUpload: ImageFile[] = postData.images.map((uri, index) => {
        // Essayer d'extraire le nom et le type de l'URI si possible, sinon utiliser des valeurs par défaut
        // Ceci est une simplification. Une solution robuste obtiendrait ces infos du sélecteur d'images.
        const fileName = uri.split('/').pop() || `photo_${Date.now()}_${index}.jpg`;
        let fileType = 'image/jpeg'; // Default type
        const extension = fileName.split('.').pop()?.toLowerCase();
        if (extension === 'png') {
          fileType = 'image/png';
        } else if (extension === 'gif') {
          fileType = 'image/gif';
        }
        // Add more types if needed

        return {
          uri: uri,
          name: fileName,
          type: fileType,
        };
      });

      // Appeler la fonction addPost du contexte.
      // Elle utilise en interne le postData du contexte (qui inclut title, price, address, desc, etc.)
      // et les imageFiles fournis ici pour la partie 'img' du FormData.
      await addPost(imageFilesToUpload);

      Alert.alert('Succès', 'Propriété ajoutée avec succès !');
      clearPostData(); // Réinitialiser les données du formulaire dans le contexte
      navigation.navigate('Tab', {screen: 'Explore'}); // Revenir à l'écran principal de la pile ou naviguez vers une route spécifique
      // ou navigation.navigate('Home'); // par exemple
    } catch (error) {
      console.error("Erreur lors de l'ajout de la propriété:", error);
      Alert.alert(
        'Erreur',
        'Une erreur est survenue lors de l\'ajout de la propriété. Veuillez réessayer.'
      );
    } finally {
      setIsLoading(false);
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
            disabled={isLoading}
          />
          <TextInput
            label="Ville"
            value={postData.city}
            onChangeText={(text: string) => updatePostData('city', text)}
            mode="outlined"
            style={styles.input}
            disabled={isLoading}
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
            disabled={isLoading}
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
        disabled={isLoading || postData.latitude === null || postData.longitude === null}
        loading={isLoading} // Affiche l'ActivityIndicator de react-native-paper
      >
        {isLoading ? 'Ajout en cours...' : 'Ajouter la Propriété'}
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
