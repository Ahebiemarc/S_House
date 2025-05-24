// Écran pour saisir les informations générales, les pièces et les images (TypeScript)

//screen/detailPost.tsx

import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, Image, FlatList, TouchableOpacity } from 'react-native'; // Ajout de Image, FlatList, TouchableOpacity
import { TextInput, Button, Text, RadioButton, Card, Title, IconButton } from 'react-native-paper'; // Ajout de IconButton
import { Picker } from '@react-native-picker/picker';
import { StackScreenProps } from '@react-navigation/stack';
import { launchImageLibrary, ImageLibraryOptions, Asset } from 'react-native-image-picker'; // *** Importer image-picker ***
import { RootStackParamList } from '../../domain/types/route.types';
import { usePostData} from '../../application/hooks/usePost';
import { Property, Type } from '../../domain/enum/post';
import ProtectedRoute from '../../application/routes/Protected.route';

// Définir les props pour cet écran
type DetailProps = StackScreenProps<RootStackParamList, 'DetailsAddPost'>;

const DetailsAddPost: React.FC<DetailProps> = ({ navigation, route }) => {
  const { postId } = route.params || {}; // Récupérer postId s'il existe
  const { postData, updatePostData, setImages, loadPostForEditing, clearPostData, setCurrentEditingPostId, currentEditingPostId } = usePostData();


  // Charger les données du post si postId est fourni (mode édition)
  /*useEffect(() => {
    if (postId) {
      setCurrentEditingPostId(postId); // Indiquer qu'on est en mode édition
      loadPostForEditing(postId).catch(err => {
          Alert.alert("Erreur", "Impossible de charger les données du post pour modification.");
          navigation.goBack(); // Revenir en arrière si le chargement échoue
      });
    } else {

      if(currentEditingPostId) { // Si on vient d'un mode édition annulé
          clearPostData();
      }
      setCurrentEditingPostId(null);
    }
    // Nettoyage au démontage si on quitte le mode édition sans sauvegarder
    return () => {
        // Si on quitte cet écran et qu'on était en mode édition,
        // on pourrait vouloir nettoyer postData si la sauvegarde n'a pas eu lieu.
        // Mais clearPostData ici pourrait être trop agressif si on navigue vers LocationScreen.
        // La gestion du "reset" est mieux gérée après soumission ou annulation explicite.
    };
  }, [postId, loadPostForEditing, navigation, clearPostData, setCurrentEditingPostId]);*/

  useEffect(() => {
    if (postId) { // ou un autre champ de contrôle pour éviter le rechargement
      setCurrentEditingPostId(postId);
      loadPostForEditing(postId).catch(err => {
        Alert.alert("Erreur", "Impossible de charger les données du post pour modification.");
        navigation.goBack();
      });
    } else {
      if(currentEditingPostId) {
        clearPostData();
      }
      setCurrentEditingPostId(null);
    }
  }, [postId]);

  // Gérer la navigation vers l'écran suivant
  const handleNext = (): void => {
    if (postData.title && postData.price && postData.bedroom && postData.bathroom) {
      navigation.navigate('LocationAddPost', {postId});
    } else {
      Alert.alert('Champs requis', 'Veuillez remplir tous les champs requis (Titre, Prix, Chambres, Salles de bain).');
    }
  };

  // *** Nouveau: Fonction pour ouvrir la galerie d'images ***
  const handleChoosePhotos = () => {
    const options: ImageLibraryOptions = { mediaType: 'photo', quality: 0.8, selectionLimit: 0 };
    launchImageLibrary(options, (response) => {
      if (response.didCancel) { console.log('Picker annulé'); }
      else if (response.errorCode) { Alert.alert('Erreur', response.errorMessage || "Erreur images."); }
      else if (response.assets && response.assets.length > 0) {
         
        setImages([...postData.images, ...response.assets]);
        //setImages(response.assets);
      }
    });
  };

  // *** Nouveau: Fonction pour supprimer une image de l'aperçu ***
  const handleRemoveImage = (uriToRemove: string | undefined) => {
    if (!uriToRemove) return;
    const updatedImages = postData.images.filter(asset => asset.uri !== uriToRemove);
    setImages(updatedImages);
  };

  // *** Nouveau: Rendu d'un élément d'aperçu d'image ***
  const renderImagePreview = ({ item }: { item: Asset }) => (
      <View style={styles.previewImageContainer}>
          <Image source={{ uri: item.uri }} style={styles.previewImage} />
          <IconButton
              icon="close-circle"
              iconColor="red"
              size={20}
              onPress={() => handleRemoveImage(item.uri)}
              style={styles.removeImageIcon}
          />
      </View>
  );
  

  return (
    <ScrollView style={styles.container}>
      {/* --- Section Détails de la Propriété --- */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>Détails de la Propriété</Title>
          {/* Champs existants: Titre, Prix, Description, Type, Propriété */}
           <TextInput
            label="Titre de l'annonce"
            value={postData.title}
            onChangeText={(text: string) => updatePostData('title', text)}
            mode="outlined"
            style={styles.input}
          />
          <TextInput
            label="Prix (en DT)"
            value={postData.price}
            onChangeText={(text: string) => updatePostData('price', text)}
            keyboardType="numeric"
            mode="outlined"
            style={styles.input}
          />
          <TextInput
            label="Description"
            value={postData.desc}
            onChangeText={(text: string) => updatePostData('desc', text)}
            mode="outlined"
            multiline
            numberOfLines={4}
            style={styles.input}
          />
          <Text style={styles.label}>Type d'opération :</Text>
          <RadioButton.Group
            onValueChange={(newValue: string) => updatePostData('type', newValue as keyof typeof Type)}
            value={postData.type}
          >
            <View style={styles.radioContainer}>
              {(Object.keys(Type) as Array<keyof typeof Type>).map((key) => (
                <View key={key} style={styles.radioButton}>
                  <RadioButton value={key} />
                  <Text>{Type[key]}</Text>
                </View>
              ))}
            </View>
          </RadioButton.Group>
          <Text style={styles.label}>Type de propriété :</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={postData.property}
              onValueChange={(itemValue: string) => updatePostData('property', itemValue as keyof typeof Property)}
              style={styles.picker}
            >
              {(Object.keys(Property) as Array<keyof typeof Property>).map((key) => (
                <Picker.Item key={key} label={Property[key]} value={key} />
              ))}
            </Picker>
          </View>
        </Card.Content>
      </Card>

      {/* --- Section Informations sur les Pièces --- */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>Informations sur les Pièces</Title>
          {/* Champs existants: Chambres, Salles de bain */}
           <TextInput
            label="Nombre de chambres"
            value={postData.bedroom}
            onChangeText={(text: string) => updatePostData('bedroom', text)}
            keyboardType="numeric"
            mode="outlined"
            style={styles.input}
          />
          <TextInput
            label="Nombre de salles de bain"
            value={postData.bathroom}
            onChangeText={(text: string) => updatePostData('bathroom', text)}
            keyboardType="numeric"
            mode="outlined"
            style={styles.input}
          />
        </Card.Content>
      </Card>

      {/* --- Section Images --- */}
      <Card style={styles.card}>
        <Card.Content>
            <Title style={styles.title}>Images de la Propriété</Title>
            {/* Bouton pour ajouter des images */}
            <Button
                icon="camera-plus"
                mode="outlined"
                onPress={handleChoosePhotos}
                style={styles.imageButton}
            >
                Ajouter des Images
            </Button>

            {/* Aperçu des images sélectionnées */}
            {postData.images.length > 0 && (
                <FlatList
                    data={postData.images}
                    renderItem={renderImagePreview}
                    keyExtractor={(item, index) => index.toString()} // Utiliser l'index comme clé est ok ici car la liste change peu
                    horizontal={true} // Affichage horizontal
                    showsHorizontalScrollIndicator={false} // Masquer la barre de défilement
                    style={styles.previewList}
                />
            )}
             {postData.images.length === 0 && (
                 <Text style={styles.noImageText}>Aucune image sélectionnée.</Text>
             )}
        </Card.Content>
      </Card>

      {/* Bouton Suivant */}
      <Button
        mode="contained"
        onPress={handleNext}
        style={styles.button}
        labelStyle={styles.buttonLabel}
      >
        Suivant
      </Button>
    </ScrollView>
  );
};

// Styles pour l'écran DetailsScreen (ajout des styles pour les images)
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
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#555',
    fontWeight: 'bold',
  },
  radioContainer: {
    flexDirection: 'row',
    marginBottom: 15,
    justifyContent: 'space-around',
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  button: {
    marginTop: 10,
    marginBottom: 20,
    paddingVertical: 8,
    borderRadius: 25,
  },
  buttonLabel: {
      fontSize: 16,
      fontWeight: 'bold',
  },
  // *** Nouveaux styles pour les images ***
  imageButton: {
      marginTop: 5,
      marginBottom: 15,
      borderColor: '#6200ee',
  },
  previewList: {
      marginTop: 10,
  },
  previewImageContainer: {
      position: 'relative', // Pour positionner l'icône de suppression
      marginRight: 10, // Espace entre les images
      borderWidth: 1,
      borderColor: '#ddd',
      borderRadius: 5,
      overflow: 'hidden', // Pour que l'icône ne dépasse pas
  },
  previewImage: {
      width: 100,
      height: 100,
      borderRadius: 5,
  },
  removeImageIcon: {
      position: 'absolute',
      top: -5, // Ajuster la position
      right: -5, // Ajuster la position
      backgroundColor: 'rgba(255, 255, 255, 0.7)', // Fond semi-transparent
      borderRadius: 15, // Rendre le fond rond
  },
  noImageText: {
      textAlign: 'center',
      color: '#888',
      marginTop: 10,
      marginBottom: 10,
      fontStyle: 'italic',
  }
});

//export default DetailsAddPost;

export default function ProtectedDetailsAddPost(props: DetailProps) {
    return (
      <ProtectedRoute>
        <DetailsAddPost {...props} />
      </ProtectedRoute>
    );
}