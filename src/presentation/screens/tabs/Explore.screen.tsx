// screen/Explore.tabs.srceen.tsx

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Alert, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import {TabStackScreenProps } from "../../../domain/types/route.types";
import ExploreHeader from "../../components/ExploreHeader.component";
import Listings from "../../components/Listings.component";
import Ionicons from 'react-native-vector-icons/Ionicons';

import Colors from '../../../application/utils/constants/Color'

import listingsDataGeo from '../../assets/data/airbnb-listings.geo.json'
import { usePostData } from "../../../application/hooks/usePost";
import { PostData } from "../../../domain/interface/Post.interface";
import { Property } from "../../../domain/enum/post";


type Props = TabStackScreenProps<'Explore'>;

const Explore: React.FC<Props> = ({ navigation, route }) => {
  const { getAllPosts, getPostsByProperty } = usePostData();
  const [posts, setPosts] = useState<PostData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // La catégorie initiale peut être la première de votre enum Property ou une valeur par défaut
  const [currentCategory, setCurrentCategory] = useState<string>('All'); 
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);


  const fetchAllPosts = useCallback(async () => {
    try {
      setIsLoading(true);
      setIsRefreshing(true); // Indique le début du rafraîchissement
      setError(null);
      const fetchedPosts = await getAllPosts();
      setPosts(fetchedPosts);
    } catch (err: any) {
      console.error("Erreur lors de la récupération de tous les posts:", err);
      setError(err.message || "Une erreur est survenue.");
      Alert.alert("Erreur de chargement", "Impossible de récupérer les propriétés.");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false); 

    }
  }, [getAllPosts]);

  const fetchPostsByCategory = useCallback(async (property: string) => {
    try {
      setIsLoading(true);
      setIsRefreshing(true); // Indique le début du rafraîchissement
      setError(null);
      const fetchedPosts = await getPostsByProperty(property as Property);
      setPosts(fetchedPosts);
    } catch (err: any) {
      console.error(`Erreur lors de la récupération des posts pour la propriété ${property}:`, err);
      setError(err.message || "Une erreur est survenue.");
      Alert.alert("Erreur de chargement", `Impossible de récupérer les propriétés pour ${property}.`);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [getPostsByProperty]);

  useEffect(() => {
    
    // Charger tous les posts au montage initial ou la catégorie par défaut
    if (currentCategory == 'All' || !currentCategory) { // Si vous avez une catégorie "Tous"
        fetchAllPosts();
        console.log(currentCategory);

    } else {
        fetchPostsByCategory(currentCategory);
    }

    

      // On nettoie le paramètre `refresh` pour éviter des appels futurs
      navigation.setParams({ refresh: false });
    
  }, [fetchAllPosts, fetchPostsByCategory, currentCategory, route.params?.refresh]); // Dépendance à currentCategory

  const onCategoryChanged = (category: Property) => {
    console.log("Nouvelle catégorie sélectionnée: " + category);
    setCurrentCategory(category); 
    // Le useEffect ci-dessus s'occupera de récupérer les données pour la nouvelle catégorie
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ExploreHeader onCategoryChanged={onCategoryChanged} />
      <Listings 
        posts={posts} 
        category={currentCategory as Property} 
        isLoading={isLoading}
        error={error}
        onRefresh={() => fetchPostsByCategory(currentCategory)} // Pour un pull-to-refresh
        isRefreshing={isRefreshing} // Passez l'état de rafraîchissement
      />
      <View style={styles.absoluteView}>
        <TouchableOpacity 
          onPress={() => navigation.navigate('Map', { items: posts})} 
          style={styles.btn}
        >
          <Text style={styles.mapButtonText}>Map</Text>
          <Ionicons name="map" size={20} style={styles.mapButtonIcon} color={'#fff'} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.lightGray, // Couleur de fond pour la zone sûre
  },
  absoluteView: {
    position: 'absolute',
    bottom: 30,
    width: '100%',
    alignItems: 'center',
  },
  btn: {
    backgroundColor: Colors.dark, // Utilisez vos constantes de couleur
    paddingVertical: 12, // Ajustez le padding
    paddingHorizontal: 25, // Ajustez le padding
    height: 50,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 5, // Ombre pour le bouton
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  mapButtonText: {
    fontFamily: 'Poppins-SemiBold', // Assurez-vous que cette police est chargée
    color: '#fff',
    fontSize: 16,
  },
  mapButtonIcon: {
    marginLeft: 10,
  },
  // Styles pour le contenu vide et les erreurs sont maintenant dans Listings.component.tsx
});

export default Explore;