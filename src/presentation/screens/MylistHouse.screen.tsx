// screen/MyListHouse.modal.tsx
import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Animated,
  Alert,
} from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';
import { RootStackScreenProps } from '../../domain/types/route.types';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Colors from "../../application/utils/constants/Color";
import { PostData } from '../../domain/interface/Post.interface';
import { usePostData } from '../../application/hooks/usePost';






const PostSkeleton = () => (
  <View style={styles.skeletonContainer}>
    <View style={styles.skeletonImage} />
    <View style={styles.skeletonTextContainer}>
      <View style={styles.skeletonLineShort} />
      <View style={styles.skeletonLineMedium} />
      <View style={styles.skeletonLineLong} />
    </View>
  </View>
);






type Props = RootStackScreenProps<'MyListHouse'>

const Screen: React.FC<Props> = ({route, navigation}) => {
  //const { items } = route.params;
  //const [userPosts, setuserPosts] = useState<UserPost[]>(items);
  const [userPosts, setuserPosts] = useState<PostData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const {getPostByUser, removePost} = usePostData()

  // Fonction pour supprimer un post de la liste des favoris
  /*const removeFavorite = (postId: string) => {
    setuserPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
  };*/


  const fetchUserPosts = useCallback(async () => {
      try {
        setIsLoading(true);
        const fetchedPosts = await getPostByUser();
        setuserPosts(fetchedPosts);
      } catch (err: any) {
        console.error("Erreur lors de la récupération de tous les posts:", err);
        Alert.alert("Erreur de chargement", "Impossible de récupérer les post.");
      } finally {
        setIsLoading(false);
  
      }
    }, [getPostByUser]);
  
  const fetchDeletePost = useCallback(async (postId: string) => {
      try {
        setIsLoading(true);
        await removePost(postId);
        const fetchedPosts = await getPostByUser();
        setuserPosts(fetchedPosts);
        //setuserPosts(fetchedPosts);
      } catch (err: any) {
        console.error(`Erreur lors de la suppression des posts pour la propriété :`, err);
        Alert.alert(`Erreur lors de la suppression des posts pour la propriété`);
      } finally {
        setIsLoading(false);
      }
  }, [removePost]);


  useEffect(() => {
      
          fetchUserPosts();

    }, [fetchUserPosts, fetchDeletePost]);


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

  const handleEditPost = (postId: string | undefined) => {
    if (!postId) {
      Alert.alert("Erreur", "ID du post non disponible pour la modification.");
      return;
    }
    // Naviguer vers DetailsScreen avec postId.
    // DetailsScreen utilisera ce postId pour appeler loadPostForEditing.
    navigation.navigate('DetailsAddPost', { postId: postId });
  };

  if (isLoading ) { // Affiche le skeleton seulement au chargement initial si pas de posts
    return (
      <>
      {[...Array(7)].map((_, index) => (
        <PostSkeleton key={index} />
      ))}
    </>
    );
  }

      

  // Rendu de chaque élément de la liste des posts
  const renderPostItem = (data: { item: PostData }, rowMap: any) => (
    
    <TouchableOpacity style={styles.postItemContainer} activeOpacity={0.9}  onPress={() => handleEditPost(data.item.id)}>
      <View style={styles.postItem}>
        {/* Placeholder pour l'image du post */ }
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
          onPress={() => fetchDeletePost(data.item.id!)}>
          <Text style={styles.heartIcon}>❤️</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  // Rendu du bouton de suppression caché pour le swipe
  const renderHiddenItem = (data: { item: PostData }, rowMap: any) => (
    <View style={styles.rowBack}>
      <TouchableOpacity
        style={[styles.backRightBtn, styles.backRightBtnRight]}
        onPress={() => {
          if (rowMap[data.item.id!]) {
            rowMap[data.item.id!].closeRow();
          }
          fetchDeletePost(data.item.id!);
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
        keyExtractor={item => item.id!}
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
  skeletonContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 15,
    marginBottom: 15,
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  skeletonImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    backgroundColor: '#e0e0e0',
    marginRight: 15,
  },
  skeletonTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  skeletonLineShort: {
    width: '60%',
    height: 10,
    backgroundColor: '#e0e0e0',
    marginBottom: 10,
    borderRadius: 5,
  },
  skeletonLineMedium: {
    width: '80%',
    height: 10,
    backgroundColor: '#e0e0e0',
    marginBottom: 10,
    borderRadius: 5,
  },
  skeletonLineLong: {
    width: '40%',
    height: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
  },
});

export default Screen;
