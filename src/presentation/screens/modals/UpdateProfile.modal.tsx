// UpdateProfile.screen.tsx
import React, { FC, useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
  Alert,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Asset, ImageLibraryOptions, launchImageLibrary } from 'react-native-image-picker';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Colors from '../../../application/utils/constants/Color';
import { KeyboardAvoidingView } from 'react-native';
import { useUser } from '../../../application/hooks/useUser';
import { UserProfileUpdateData } from '../../../domain/interface/User.interface';
import { RootStackScreenProps } from '../../../domain/types/route.types';
import { defaultStyles } from "../../../application/utils/constants/Styles";


const defautProfile = require('../../../presentation/assets/images/defautProfile.png');


type Props = RootStackScreenProps<'UpdateProfile'>

const UpdateProfile: FC<Props> = ({navigation,}) => {
  const { currentUser, updateUserProfile, isLoading, error, clearError } = useUser();

  const [formData, setFormData] = useState<UserProfileUpdateData>({username: '', email: '', password: '',});
  const [selectedAvatar, setSelectedAvatar] = useState<Asset | null>(null);
  const [previewAvatar, setPreviewAvatar] = useState<string | undefined>(undefined);


  useEffect(() => {
    if (currentUser) {
        setFormData({
            username: currentUser.username || '',
            email: currentUser.email || '',
            password: '',
        });
    
      setPreviewAvatar(currentUser.avatar || undefined);
      setSelectedAvatar(null); // Réinitialiser l'avatar sélectionné à chaque ouverture
    }
    else { // Nettoyer l'erreur quand le modal est fermé
        clearError();
    }
  }, [currentUser, clearError])

  const handlePickAvatar = () => {

    const options: ImageLibraryOptions = {
        mediaType: 'photo',
        quality: 0.8,
        selectionLimit: 1,
      }
    launchImageLibrary(options, (response) => {
        if (response.didCancel) { console.log('Picker annulé'); }
        else if (response.errorCode) { Alert.alert('Erreur', response.errorMessage || "Erreur images."); }
        else if (response.assets && response.assets.length > 0) { 
            const selectedImage  = response.assets[0]  
            setSelectedAvatar(selectedImage);
            setPreviewAvatar(selectedImage.uri);

        }
      }
    );
  };

  const handleInputChange = (field: keyof UserProfileUpdateData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!currentUser) return;

    const dataToUpdate: UserProfileUpdateData = {};
    let hasChanges = false;

    if (formData.username?.trim() !== (currentUser.username || '')) {
      dataToUpdate.username = formData.username?.trim();
      hasChanges = true;
    }
    if (formData.email?.trim() !== (currentUser.email || '')) {
      dataToUpdate.email = formData.email?.trim();
      hasChanges = true;
    }
    
    if (formData.password) {
      dataToUpdate.password = formData.password;
      hasChanges = true;
    }

    if (!hasChanges && !selectedAvatar) {
      Alert.alert("Aucune modification", "Vous n'avez rien modifié.");
      return;
    }

    const success = await updateUserProfile(dataToUpdate, selectedAvatar || undefined);
    if (success) {
      Alert.alert('Succès', 'Profil mis à jour avec succès !');
      navigation.goBack();
      
    } else {
      // L'erreur est gérée par le UserProvider, on pourrait afficher une alerte si `error` est non null
      // Alert.alert('Erreur', error || 'Impossible de mettre à jour le profil.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoiding}
      >

        <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContentContainer}
        >
          <Text style={styles.title}>Tes informations</Text>
          <Text style={styles.subtitle}>
            Modifier ses coordonnées  plus facilement.
          </Text>

          <View style={styles.avatarSection}>
            <Image
              source={previewAvatar ? { uri: previewAvatar } : defautProfile}
              style={styles.avatar}
            />
            <TouchableOpacity style={styles.avatarEditButton} onPress={handlePickAvatar}>
              <Ionicons name="camera-outline" size={20} color={Colors.light} />
            </TouchableOpacity>
          </View>

          {error && <Text style={styles.errorTextTop}>{error}</Text>}

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Nom d'utilisateur"
              value={formData.username}
              onChangeText={(val) => handleInputChange('username', val)}
              autoCapitalize="none"
              placeholderTextColor="#000"

            />
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Email (ex: markus@gmail.com)"
              value={formData.email}
              onChangeText={(val) => handleInputChange('email', val)}
              keyboardType="email-address"
              placeholderTextColor="#000"

            />
          </View>
          

          <Text style={styles.sectionTitle}>Changer le mot de passe (optionnel)</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Mot de passe actuel"
              value={formData.password}
              onChangeText={(val) => handleInputChange('password', val)}
              secureTextEntry
              placeholderTextColor="#000"
            />
          </View>   

        </ScrollView>
        <View style={styles.footer}>
            <TouchableOpacity
                style={[defaultStyles.btn, styles.saveButton, isLoading && styles.saveButtonDisabled]}
                onPress={handleSubmit}
                disabled={isLoading}
            >
                {isLoading ? (
                <ActivityIndicator color={Colors.light} />
                ) : (
                <Text style={defaultStyles.btnText}>Save</Text>
                )}
            </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background, // Couleur de fond générale de l'écran
  },
  keyboardAvoiding: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingTop: Platform.OS === 'ios' ? 10 : 20,
    paddingBottom: 10,
  },
  backButton: {
    padding: 5, // Augmente la zone cliquable
  },
  scrollContentContainer: {
    paddingHorizontal: 25,
    paddingBottom: 20, // Espace pour le bouton Enregistrer flottant
  },
  title: {
    fontFamily: 'Poppins-Bold',
    fontSize: 28,
    color: Colors.dark,
    marginTop: 10,
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Poppins-Regular',
    fontSize: 15,
    color: Colors.greyDark, // Une couleur de gris plus foncée
    marginBottom: 25,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 30,
    position: 'relative', // Pour positionner le bouton d'édition de l'avatar
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: Colors.greyLines,
  },
  avatarEditButton: {
    position: 'absolute',
    right: '35%', // Ajustez pour bien positionner sur l'avatar
    bottom: 0,
    backgroundColor: Colors.dark, // Un fond pour le bouton
    padding: 8,
    borderRadius: 20, // Cercle parfait
    borderWidth: 2,
    borderColor: Colors.light, // Bordure pour se détacher
  },
  inputContainer: {
    marginBottom: 18,
  },
  input: {
    backgroundColor: Colors.light, // Fond blanc pour les inputs
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 12, // Bords plus arrondis
    borderWidth: 1,
    borderColor: Colors.greyLines, // Bordure très légère
    color: Colors.dark,
  },
  bioInput: {
    height: 100, // Hauteur pour le champ bio
    textAlignVertical: 'top', // Pour Android
  },
  charCounter: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: Colors.grey,
    textAlign: 'right',
    marginTop: 4,
  },
  sectionTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: Colors.dark,
    marginTop: 20,
    marginBottom: 10,
  },
  footer: {
    paddingHorizontal: 25,
    paddingVertical: Platform.OS === 'ios' ? 20 : 15, // Padding pour le bouton en bas
    backgroundColor: Colors.background, // Assorti au fond de l'écran
  },
  saveButton: {
    backgroundColor: Colors.primary, // Couleur principale pour le bouton
    // Les styles de defaultStyles.btn (comme la couleur du texte) seront appliqués
  },
  saveButtonDisabled: {
    backgroundColor: Colors.grey,
  },
  errorTextTop: { // Erreur affichée en haut du formulaire
    color: Colors.danger,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    marginBottom: 15,
    fontSize: 14,
  },
});

export default UpdateProfile;