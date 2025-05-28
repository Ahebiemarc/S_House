// src/screens/AddReviewScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { ReviewProvider, useReviews } from '../../../application/providers/ReviewContext';
import { StarRating } from '../../components/StarRating';
import { RootStackScreenProps } from '../../../domain/types/route.types';
import ProtectedRoute from '../../../application/routes/Protected.route';


type Props = RootStackScreenProps<'AddReview'>


const AddReviewScreen: React.FC<Props> = ({ navigation, route }) => {
  const { postId } = route.params;
  const { addReview, isLoading } = useReviews();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const handleSubmit = async () => {
    if (rating === 0) {
      Alert.alert('Validation Error', 'Please select a star rating.');
      return;
    }
    if (comment.trim() === '') {
      Alert.alert('Validation Error', 'Please write a comment.');
      return;
    }

    const success = await addReview(postId, { rating, comment });
    if (success) {
      Alert.alert('Success', 'Your review has been submitted!');
      navigation.navigate('Tab', {screen: 'Explore' ,params:{refresh: true}});
    } else {
      // L'erreur est gérée et affichée globalement par le provider,
      // mais on peut afficher une alerte spécifique ici si besoin.
      Alert.alert('Error', 'Could not submit your review. Please try again.');
    }
  };

  return (
    <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
    >
        <ScrollView contentContainerStyle={styles.scrollContent}>
            {/* Header de l'application (simulé) 
            <View style={styles.appHeader}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back-outline" size={28} color="#333" />
                </TouchableOpacity>
                <Text style={styles.appHeaderTitle}>Rate & Review</Text>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons name="close-outline" size={30} color="#333" />
                </TouchableOpacity>
            </View>*/}

            <View style={styles.formContainer}>
                <Text style={styles.title}>Évaluez cette maison</Text>
                <StarRating rating={rating} onRate={setRating} size={36} color="#FFC107" style={styles.starSelector} />

                <Text style={styles.title}>Donnez votre avis</Text>
                <TextInput
                style={styles.textInput}
                placeholder="Écrivez ici"
                placeholderTextColor="#A0A0A0"
                multiline
                numberOfLines={5}
                value={comment}
                onChangeText={setComment}
                textAlignVertical="top" // Pour Android
                />

                <TouchableOpacity
                style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
                onPress={handleSubmit}
                disabled={isLoading}
                >
                {isLoading ? (
                    <ActivityIndicator color="#FFFFFF" />
                ) : (
                    <Text style={styles.submitButtonText}>Submit</Text>
                )}
                </TouchableOpacity>
            </View>
        </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F6F8', // Un fond légèrement différent de l'image pour le contraste
  },
  scrollContent: {
    flexGrow: 1,
  },
  appHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingTop: Platform.OS === 'ios' ? 50 : 20, // Safe area pour iOS
    paddingBottom: 15,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  appHeaderTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  formContainer: {
    padding: 20,
    flex: 1, // Permet au bouton de rester en bas si le contenu n'est pas assez grand
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#444',
    marginBottom: 10,
    marginTop: 20,
  },
  starSelector: {
    alignSelf: 'center',
    marginVertical: 20,
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D0D0D0',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    minHeight: 120, // Hauteur minimale
    color: '#333',
  },
  submitButton: {
    backgroundColor: '#FF385C', // Noir/gris foncé comme sur l'image
    paddingVertical: 18,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 'auto', // Pousse le bouton vers le bas
    marginBottom: 20,
  },
  submitButtonDisabled: {
    backgroundColor: '#FF385C',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

//export default AddReviewScreen;

export default function ProtectedAddReviewScreen(props: Props) {
    const { postId } = props.route.params;
    return (
      <ReviewProvider postId={postId}>
        <ProtectedRoute>
            <AddReviewScreen {...props} />
        </ProtectedRoute>
      </ReviewProvider>
    );
}