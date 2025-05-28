//components/Listings.component.tsx

import React, { useEffect, useRef, useState } from "react";
import { FlatList, Image, ListRenderItem, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { defaultStyles } from "../../application/utils/constants/Styles";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../domain/types/route.types";
import { useNavigation } from "@react-navigation/native";
import Ionicons from 'react-native-vector-icons/Ionicons';
import Animated, { FadeInRight, FadeOutLeft } from "react-native-reanimated";
import { formatText } from "../../application/utils/functions/functions";
import ListingSkeleton from "./ListingsSkeleton.component.tsx";
import { PostData } from "../../domain/interface/Post.interface";
import  Colors from "../../application/utils/constants/Color.ts"
import { Property, Type } from "../../domain/enum/post.ts";
import { useFavorites } from "../../application/providers/FavoritesContext.tsx";


const PropertyLabels: Record<Property, string> = {
    [Property.APARTMENT]: "Appartement",
    [Property.HOUSE]: "Maison",
    [Property.VILLA]: "Villa",
    [Property.NO_FURNITURE]: "Non meublé",
    [Property.FURNITURE]: "Meublé",
    [Property.DUPLEX]: "Duplex",
    [Property.STUDIO]: "Studio",
    [Property.S_1]: "S+1",
    [Property.S_2]: "S+2",
    [Property.S_3]: "S+3",
    [Property.All]: "Toutes les propriétés"
};

const TypeLabel: Record<Type, string> = {
    [Type.BUY]: "A acheter",
    [Type.RENT]: "A louer",
};

interface Props {
    posts: PostData[]; // Utiliser PostData[] au lieu de any[]
    category: Property; // La catégorie actuelle (propriété)
    isLoading: boolean; // Pour le chargement initial / changement de catégorie (affiche le skeleton)
    error?: string | null;
    onRefresh?: () => void; // Fonction à appeler lors du pull-to-refresh
    isRefreshing?: boolean; // État pour contrôler l'indicateur de rafraîchissement de FlatList
  }
  
  type ListingsNavigationProp = StackNavigationProp<RootStackParamList, 'Tab'>; // Ou le nom de votre route de stack
  
  const Listings: React.FC<Props> = ({ posts, category, isLoading, error, onRefresh, isRefreshing }) => {
    const navigation = useNavigation<ListingsNavigationProp>();
    const { isFavorite, toggleFavorite,favorites } = useFavorites();

  
    const handleImageError = (itemId: string | undefined) => {
      console.warn(`Erreur de chargement d'image pour le post ID: ${itemId}`);
    };
  
    const renderRow: ListRenderItem<PostData> = ({ item }) => {
      const averageRating = item.reviews.length > 0
      ? parseFloat(
          (item.reviews.reduce((sum: number, review: any) => sum + review.rating, 0) / item.reviews.length).toFixed(1)
        )
      : 0;
        
      return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => navigation.navigate('Listing', { post: item, })} // Passer l'ID ou l'item entier
      >
        <Animated.View style={styles.listing} entering={FadeInRight} exiting={FadeOutLeft}>
          <Animated.Image
            source={{ uri: item.images && item.images.length > 0 ? item.images[0] as any : 'https://placehold.co/600x400/EEE/CCC?text=Image+Non+Disponible' }}
            style={styles.image}
            onError={() => handleImageError(item.id)} // Passer l'ID de l'item
          />
          <TouchableOpacity 
            onPress={() => toggleFavorite(item)}
            style={styles.favoriteButton}
          >
            <Ionicons 
                name={isFavorite(item.id!) ? "heart" : "heart-outline"} 
                size={24} color={isFavorite(item.id!) ? "red" : "#000"} 
            />
          </TouchableOpacity>
          <View style={styles.infoContainer}>
            <View style={styles.titleRatingContainer}>
              <Text style={styles.titleText}>{formatText(item.title, 25)}</Text>
              <View style={styles.ratingContainer}>
                <Text style={styles.ratingText}> {averageRating !== 0  ? averageRating : 'N/A'} </Text> 
                <Ionicons name="star" color={Colors.gray} size={16} style={{ marginTop: 1 }} />
              </View> 
            </View>
            <Text style={styles.propertyTypeText}>{item.property} - {item.type}</Text>
            <View style={styles.priceContainer}>
              <Text style={styles.priceText}>DT {item.price}</Text>
              <Text style={styles.pricePeriodText}>/ mois</Text> 
              {/* Ajustez "mois" si la période de location varie */}
            </View>
          </View>
        </Animated.View>
      </TouchableOpacity>
      )
    };
  
    if (isLoading && (!posts || posts.length === 0) && isRefreshing) { // Affiche le skeleton seulement au chargement initial si pas de posts
      return <ListingSkeleton count={3} />;
    }
  
    if (error && (!posts || posts.length === 0)) { // Affiche l'erreur seulement si pas de posts à afficher
      return (
        <View style={styles.centeredMessageContainer}>
          <Ionicons name="cloud-offline-outline" size={60} color={Colors.grey} />
          <Text style={styles.errorText}>Erreur de chargement des données.</Text>
          <Text style={styles.errorDetailText}>{error}</Text>
          {/* Optionnel: Bouton pour réessayer */}
        </View>
      );
    }
  
    if (!isLoading && (!posts || posts.length === 0) && !isRefreshing) { // Affiche le message vide si pas de chargement et pas de posts
      return (
        <View style={styles.centeredMessageContainer}>
          <Text style={styles.emptyIcon}>🏠</Text>
          <Text style={styles.emptyText}>Aucune propriété trouvée pour "{PropertyLabels[category]}".</Text>
          <Text style={styles.emptySubText}>Essayez de sélectionner une autre catégorie ou vérifiez plus tard !</Text>
        </View>
      );
    }
  
    return (
      <View style={defaultStyles.container}>
        <FlatList
          renderItem={renderRow}
          keyExtractor={(item) => item.id || String(Date.now() * Math.random())} // Assurez-vous que chaque post a un ID unique
          data={posts}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 80 }} // Espace pour le bouton Map flottant
          onRefresh={onRefresh} 
          refreshing={isRefreshing} // Contrôle l'indicateur de rafraîchissement
          extraData={favorites} // 🔁 Rafraîchit la FlatList quand favoris changent

        />
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    listing: {
      padding: 16,
      gap: 10,
      marginVertical: 8, // Réduit pour un look plus compact si désiré
      backgroundColor: '#fff', // Fond pour chaque carte de listing
      borderRadius: 10,
      elevation: 3, // Ombre subtile
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowRadius: 5,
      shadowOffset: { width: 0, height: 2 },
    },
    image: {
      width: '100%',
      height: 250, // Hauteur d'image ajustée
      borderRadius: 10,
      backgroundColor: '#e0e0e0', // Couleur de fond pendant le chargement de l'image
    },
    favoriteButton: {
      position: 'absolute',
      right: 30,
      top: 30,
      backgroundColor: "rgba(255, 255, 255, 0.8)", // Fond semi-transparent
      borderRadius: 30,
      padding: 8, // Padding ajusté
    },
    infoContainer: {
      marginTop: 5,
    },
    titleRatingContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 5,
    },
    titleText: {
      fontSize: 18, // Taille de police augmentée
      fontFamily: 'Poppins-Bold', // Assurez-vous que cette police est chargée
      flex: 1, // Permet au titre de prendre l'espace disponible
      color: Colors.grey,
      
    },
    ratingContainer: {
      flexDirection: 'row',
      alignItems: 'center', // Alignement vertical des étoiles et du texte
      gap: 4,
    },
    ratingText: {
      fontFamily: 'Poppins-Bold',
      color: Colors.grey,
      
    },
    propertyTypeText: {
      fontFamily: 'Poppins-Medium', // Assurez-vous que cette police est chargée
      color: Colors.grey, // Couleur pour le type de propriété
      marginBottom: 5,
    },
    priceContainer: {
      flexDirection: 'row',
      alignItems: 'baseline', // Aligne le prix et la période sur la ligne de base
      gap: 4,
    },
    priceText: {
      fontFamily: 'Poppins-Bold',
      fontSize: 16,
      color: Colors.grey,
      
    },
    pricePeriodText: {
      fontFamily: 'Poppins-Medium',
      color: Colors.dark, // Couleur pour la période
      
    },
    centeredMessageContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
      marginTop: 50,
    },
    emptyIcon: {
      fontSize: 60, // Taille de l'icône augmentée
      marginBottom: 15,
    },
    emptyText: {
      fontSize: 18,
      fontFamily: 'Poppins-SemiBold', // Assurez-vous que cette police est chargée
      textAlign: 'center',
      color: Colors.dark,
      marginBottom: 5,
    },
    emptySubText: {
      fontSize: 14,
      fontFamily: 'Poppins-Regular', // Assurez-vous que cette police est chargée
      textAlign: 'center',
      color: Colors.grey,
    },
    errorText: {
      fontSize: 18,
      fontFamily: 'Poppins-SemiBold',
      color: 'red',
      textAlign: 'center',
      marginBottom: 5,
    },
    errorDetailText: {
      fontSize: 14,
      fontFamily: 'Poppins-Regular',
      color: Colors.grey,
      textAlign: 'center',
    }
  });
  
  export default Listings;
  