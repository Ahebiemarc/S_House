// modal/MyListHouse.modal.tsx
import React, { useLayoutEffect, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';
import { RootStackScreenProps } from '../../domain/types/route.types';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Colors from "../../application/utils/constants/Color";



// Définition des types pour Type et Property (à adapter selon votre définition réelle)
// Exemple:
// export enum Type { MAISON = "Maison", APPARTEMENT = "Appartement" }
// export enum Property { VENTE = "Vente", LOCATION = "Location" }
// Pour cet exemple, nous utiliserons des strings simples.
// Vous devrez définir ces types (Type et Property) dans votre projet.
// Pour l'instant, nous allons les typer comme string pour que le code fonctionne.
type PostType = string; // Remplacez par keyof typeof Type une fois Type défini
type PostProperty = string; // Remplacez par keyof typeof Property une fois Property défini

// Définition du type pour un post favori, basé sur votre PostData
export interface UserPost {
  id: string; // Ajout d'un ID unique pour la gestion de la liste
  title: string;
  price: string;
  address: string;
  desc: string;
  city: string;
  bedroom: string;
  bathroom: string;
  latitude: number | null;
  longitude: number | null;
  type: PostType;
  property: PostProperty;
  imageUri?: string; // Pour l'image unique
  imagePlaceholderColor: string;
}






type Props = RootStackScreenProps<'MyListHouse'>

const Screen: React.FC<Props> = ({route, navigation}) => {
  const { items } = route.params;
  const [userPosts, setuserPosts] = useState<UserPost[]>(items);

  // Fonction pour supprimer un post de la liste des favoris
  const removeFavorite = (postId: string) => {
    setuserPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
  };


   useLayoutEffect(() => {
          navigation.setOptions({
            headerTitle: '',
            headerTransparent: true,
            headerLeft: () => (
              <TouchableOpacity style={[styles.roundButton, {marginLeft: 10}]} onPress={() => navigation.goBack()}>
                <Ionicons name="chevron-back" size={24} color={'#000'} />
              </TouchableOpacity>
            ),
          });
  }, []);

      

  // Rendu de chaque élément de la liste des posts
  const renderPostItem = (data: { item: UserPost }, rowMap: any) => (
    <View style={styles.postItemContainer}>
      <View style={styles.postItem}>
        {/* Placeholder pour l'image du post */}
          <Image source={{ uri: "https://res.cloudinary.com/dr6hkslkn/image/upload/v1743320456/gyhcazlzsysk8ocmhjif.jpg" }} style={styles.postImage} />

        <View style={styles.postInfo}>
          <Text style={styles.postTitle}>{data.item.title}</Text>
          <Text style={styles.postPrice}>{data.item.price}</Text>
          <Text style={styles.postAddress}>{data.item.address}</Text>
           {/*Les actions peuvent être adaptées ou supprimées si non pertinentes pour des posts */}
          <View style={styles.postActions}>
            <TouchableOpacity style={styles.iconButton}>
              <Text style={styles.iconText}>💬</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <Text style={styles.iconText}>🏠</Text>{/* MODIFIÉ: Icône maison */}
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity
          style={styles.heartIconContainer}
          onPress={() => removeFavorite(data.item.id)}>
          <Text style={styles.heartIcon}>❤️</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // Rendu du bouton de suppression caché pour le swipe
  const renderHiddenItem = (data: { item: UserPost }, rowMap: any) => (
    <View style={styles.rowBack}>
      <TouchableOpacity
        style={[styles.backRightBtn, styles.backRightBtnRight]}
        onPress={() => {
          if (rowMap[data.item.id]) {
            rowMap[data.item.id].closeRow();
          }
          removeFavorite(data.item.id);
        }}>
        <Animated.View style={[styles.trashButton]}>
            <Text style={styles.trashIcon}>🗑️</Text>
            <Text style={styles.deleteText}>Supprimer</Text>
        </Animated.View>
      </TouchableOpacity>
    </View>
  );

  // Rendu de l'écran principal
  return (
    <SafeAreaView style={styles.safeArea}>

      {/* Contenu principal */}
      {userPosts.length === 0 ? (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>🏠</Text>
        <Text style={styles.emptyText}>Vous n'avez pas de maison ajouté</Text>
      </View>
      ) : (
      <SwipeListView
        data={userPosts}
        renderItem={renderPostItem}
        renderHiddenItem={renderHiddenItem}
        rightOpenValue={-100} // Largeur du bouton de suppression
        previewRowKey={'post1'} // Utiliser un ID existant pour la preview
        previewOpenValue={-40}
        previewOpenDelay={3000}
        disableRightSwipe
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContentContainer}
        showsVerticalScrollIndicator={false}

      />
  )}
    </SafeAreaView>
  );
};

// Styles
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  listContentContainer: {
    paddingHorizontal: 10,
    paddingTop: 10,
  },

  roundButton: {
    width: 40,
    height: 40,
    borderRadius: 50,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    color: Colors.gray,
  },
  postItemContainer: {
    backgroundColor: '#fff',
    borderRadius: 15,
    marginBottom: 15,
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  postItem: {
    flexDirection: 'row',
    padding: 15,
    alignItems: 'flex-start', // Aligner au début pour les textes plus longs
  },
  postImage: {
    width: 80, // Légèrement plus grand pour les posts
    height: 80,
    borderRadius: 10,
    marginRight: 15,
    justifyContent: 'center',
    alignItems: 'center',
    // borderWidth: 1, // Optionnel
    // borderColor: '#ddd', // Optionnel
  },
  imagePlaceholderText: {
    fontSize: 30,
    color: '#aaa'
  },
  postInfo: {
    flex: 1,
  },
  postTitle: {
    fontSize: 17, // Ajusté pour le titre
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  postPrice: {
    fontSize: 15,
    color: '#007AFF', // Couleur pour le prix
    fontWeight: '600',
    marginBottom: 4,
  },
  postAddress: {
    fontSize: 14,
    color: '#777',
    marginBottom: 8, // Espace avant les actions
  },
  postActions: {
    flexDirection: 'row',
    marginTop: 4, // Ajusté
  },
  iconButton: {
    marginRight: 15,
    padding: 5,
  },
  iconText: {
    fontSize: 20,
  },
  heartIconContainer: {
    position: 'absolute',
    top: 10,
    left: 10,
    padding: 5,
    // backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 15,
  },
  heartIcon: {
    fontSize: 24,
    color: 'red',
  },
  rowBack: {
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingRight: 0,
    borderRadius: 15,
    marginBottom: 15,
    marginHorizontal: 5,
  },
  backRightBtn: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    width: 100,
    backgroundColor: 'red',
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
  },
  backRightBtnRight: {
    right: 0,
  },
  trashButton: {
    alignItems: 'center',
  },
  trashIcon: {
    fontSize: 24,
    color: 'white',
  },
  deleteText: {
    color: 'white',
    marginTop: 5,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyIcon: {
    fontSize: 80,
    marginBottom: 20,
    color: '#ccc',
  },
  emptyText: {
    fontSize: 18,
    color: '#777',
    textAlign: 'center',
  },
});

export default Screen;
