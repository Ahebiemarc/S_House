import React, { useState } from 'react';
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
interface FavoritePost {
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

// Données initiales des posts favoris
// Remplacez les imageUri par les URL de vos images ou utilisez des images locales
const INITIAL_FAVORITE_POSTS: FavoritePost[] = [
  {
    id: 'post1',
    title: 'Belle Villa avec Piscine',
    price: '350 000 €',
    address: '123 Rue de la Plage, Nice',
    desc: 'Magnifique villa avec vue mer et piscine privée. Idéale pour les vacances ou comme résidence principale.',
    city: 'Nice',
    bedroom: '4',
    bathroom: '3',
    latitude: 43.7102,
    longitude: 7.2620,
    type: 'Maison', // Exemple
    property: 'Vente', // Exemple
    // imageUri: 'URL_DE_VOTRE_IMAGE_VILLA',
    imagePlaceholderColor: '#B0E0E6', // Bleu poudre
  },
  {
    id: 'post2',
    title: 'Appartement Moderne Centre-Ville',
    price: '1 200 €/mois',
    address: '45 Avenue Jean Médecin, Nice',
    desc: 'Superbe appartement T3 refait à neuf, lumineux et proche de toutes commodités.',
    city: 'Nice',
    bedroom: '2',
    bathroom: '1',
    latitude: 43.7034,
    longitude: 7.2661,
    type: 'Appartement', // Exemple
    property: 'Location', // Exemple
    // imageUri: 'URL_DE_VOTRE_IMAGE_APPART',
    imagePlaceholderColor: '#FFDAB9', // Pêche
  },
  {
    id: 'post3',
    title: 'Maison de Campagne Charmante',
    price: '280 000 €',
    address: '789 Chemin des Oliviers, Grasse',
    desc: 'Maison en pierre avec grand jardin arboré, au calme absolu.',
    city: 'Grasse',
    bedroom: '3',
    bathroom: '2',
    latitude: 43.6580,
    longitude: 6.9237,
    type: 'Maison', // Exemple
    property: 'Vente', // Exemple
    imagePlaceholderColor: '#98FB98', // Vert pâle
  },
  {
    id: 'post4',
    title: 'Belle Villa avec Piscine',
    price: '350 000 €',
    address: '123 Rue de la Plage, Nice',
    desc: 'Magnifique villa avec vue mer et piscine privée. Idéale pour les vacances ou comme résidence principale.',
    city: 'Nice',
    bedroom: '4',
    bathroom: '3',
    latitude: 43.7102,
    longitude: 7.2620,
    type: 'Maison', // Exemple
    property: 'Vente', // Exemple
    // imageUri: 'URL_DE_VOTRE_IMAGE_VILLA',
    imagePlaceholderColor: '#B0E0E6', // Bleu poudre
  },
  {
    id: 'post5',
    title: 'Appartement Moderne Centre-Ville',
    price: '1 200 €/mois',
    address: '45 Avenue Jean Médecin, Nice',
    desc: 'Superbe appartement T3 refait à neuf, lumineux et proche de toutes commodités.',
    city: 'Nice',
    bedroom: '2',
    bathroom: '1',
    latitude: 43.7034,
    longitude: 7.2661,
    type: 'Appartement', // Exemple
    property: 'Location', // Exemple
    // imageUri: 'URL_DE_VOTRE_IMAGE_APPART',
    imagePlaceholderColor: '#FFDAB9', // Pêche
  },
  {
    id: 'post6',
    title: 'Maison de Campagne Charmante',
    price: '280 000 €',
    address: '789 Chemin des Oliviers, Grasse',
    desc: 'Maison en pierre avec grand jardin arboré, au calme absolu.',
    city: 'Grasse',
    bedroom: '3',
    bathroom: '2',
    latitude: 43.6580,
    longitude: 6.9237,
    type: 'Maison', // Exemple
    property: 'Vente', // Exemple
    imagePlaceholderColor: '#98FB98', // Vert pâle
  },
  {
    id: 'post7',
    title: 'Belle Villa avec Piscine',
    price: '350 000 €',
    address: '123 Rue de la Plage, Nice',
    desc: 'Magnifique villa avec vue mer et piscine privée. Idéale pour les vacances ou comme résidence principale.',
    city: 'Nice',
    bedroom: '4',
    bathroom: '3',
    latitude: 43.7102,
    longitude: 7.2620,
    type: 'Maison', // Exemple
    property: 'Vente', // Exemple
    // imageUri: 'URL_DE_VOTRE_IMAGE_VILLA',
    imagePlaceholderColor: '#B0E0E6', // Bleu poudre
  },
  {
    id: 'post8',
    title: 'Appartement Moderne Centre-Ville',
    price: '1 200 €/mois',
    address: '45 Avenue Jean Médecin, Nice',
    desc: 'Superbe appartement T3 refait à neuf, lumineux et proche de toutes commodités.',
    city: 'Nice',
    bedroom: '2',
    bathroom: '1',
    latitude: 43.7034,
    longitude: 7.2661,
    type: 'Appartement', // Exemple
    property: 'Location', // Exemple
    // imageUri: 'URL_DE_VOTRE_IMAGE_APPART',
    imagePlaceholderColor: '#FFDAB9', // Pêche
  },
  {
    id: 'post9',
    title: 'Maison de Campagne Charmante',
    price: '280 000 €',
    address: '789 Chemin des Oliviers, Grasse',
    desc: 'Maison en pierre avec grand jardin arboré, au calme absolu.',
    city: 'Grasse',
    bedroom: '3',
    bathroom: '2',
    latitude: 43.6580,
    longitude: 6.9237,
    type: 'Maison', // Exemple
    property: 'Vente', // Exemple
    imagePlaceholderColor: '#98FB98', // Vert pâle
  },
];

const Screen: React.FC = () => {
  const [favoritePosts, setFavoritePosts] = useState<FavoritePost[]>(INITIAL_FAVORITE_POSTS);

  // Fonction pour supprimer un post de la liste des favoris
  const removeFavorite = (postId: string) => {
    setFavoritePosts(prevPosts => prevPosts.filter(post => post.id !== postId));
  };

  // Rendu de chaque élément de la liste des posts
  const renderPostItem = (data: { item: FavoritePost }, rowMap: any) => (
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
  const renderHiddenItem = (data: { item: FavoritePost }, rowMap: any) => (
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
      {/* En-tête */}
      <View style={styles.header}>

        <Text style={styles.headerTitle}>Mes Favories</Text>

      </View>

      {/* Contenu principal */}
      {favoritePosts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🏠</Text>
          <Text style={styles.emptyText}>Vous n'avez pas de Maison favorites</Text>
        </View>
      ) : (
        <SwipeListView
          data={favoritePosts}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  listContentContainer: {
    paddingHorizontal: 10,
    paddingTop: 10,
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
