//modal/Reviews.modal.tsx
import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';
import { ReviewProvider, useReviews } from '../../../application/providers/ReviewContext';
import { StarRating } from '../../components/StarRating';
import { RatingBreakdown } from '../../components/RatingBreakdown';
import { ReviewItem } from '../../components/ReviewItem';
import { RootStackScreenProps } from '../../../domain/types/route.types';
import ProtectedRoute from '../../../application/routes/Protected.route';



type Props = RootStackScreenProps<'ReviewsWrapper'>


const ReviewsScreen: React.FC<Props> = ({ navigation, route }) => {
  const { postId } = route.params; // Récupérer postId via la navigation
  const { reviews, ratingStats, isLoading, error } = useReviews(); // Le provider est déjà initialisé avec postId

  if (isLoading && !reviews.length) { // Afficher le loader seulement au premier chargement
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }
  
  const renderHeader = () => (
    <>
      {ratingStats && ratingStats.total > 0 && (
        <View style={styles.summaryContainer}>
          <Text style={styles.overallRatingText}>{ratingStats.average.toFixed(1)}</Text>
          <StarRating rating={ratingStats.average} size={24} color="#FFC107" />
          <Text style={styles.basedOnText}>based on {ratingStats.total} reviews</Text>
          <RatingBreakdown stats={ratingStats} />
        </View>
      )}
    </>
  );

  return (
    <View style={styles.container}>
      {/* Header de l'application (simulé) 
      <View style={styles.appHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.appHeaderTitle}>Reviews</Text>
        <TouchableOpacity>
          <Ionicons name="help-circle-outline" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>*/}

      {reviews.length === 0 && !isLoading ? (
        <View style={styles.centered}>
          <Ionicons name="chatbubbles-outline" size={60} color="#CCCCCC" />
          <Text style={styles.emptyText}>Aucun avis pour le moment.</Text>
          <Text style={styles.emptySubText}>Soyez le premier à laisser un avis !</Text>
        </View>
      ) : (
        <FlatList
          data={reviews}
          renderItem={({ item }) => <ReviewItem review={item} />}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={renderHeader}
          contentContainerStyle={styles.listContent}
        />
      )}

      <TouchableOpacity
        style={styles.writeReviewButton}
        onPress={() => navigation.navigate('AddReview', { postId })}
      >
        <Text style={styles.writeReviewButtonText}>Write a Review</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  appHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    backgroundColor: '#F8F8F8', // Un fond léger pour le header
  },
  appHeaderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  summaryContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  overallRatingText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#333',
  },
  basedOnText: {
    fontSize: 14,
    color: '#777',
    marginTop: 5,
  },
  listContent: {
    paddingHorizontal: 15,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 20,
    color: '#555555',
    marginTop: 15,
    fontWeight: '600',
  },
  emptySubText: {
    fontSize: 16,
    color: '#777777',
    marginTop: 8,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
  },
  writeReviewButton: {
    backgroundColor: '#FFFFFF', // Fond blanc comme sur l'image
    paddingVertical: 15,
    alignItems: 'center',
    borderTopWidth: 1, // Bordure haute pour séparer
    borderColor: '#E0E0E0',
    marginHorizontal: 15, // Un peu de marge latérale
    marginBottom: 10, // Marge en bas
    borderRadius: 8, // Coins arrondis
    shadowColor: "#000", // Ombre légère
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  writeReviewButtonText: {
    fontSize: 16,
    color: '#007AFF', // Texte bleu
    fontWeight: 'bold',
  },
});

//export default ReviewsScreen;

export default function ProtectedReviewsScreen(props: Props) {
    const { postId } = props.route.params;
    return (
      <ReviewProvider postId={postId}>
        <ProtectedRoute>
            <ReviewsScreen {...props} />
        </ProtectedRoute>
      </ReviewProvider>
    );
}