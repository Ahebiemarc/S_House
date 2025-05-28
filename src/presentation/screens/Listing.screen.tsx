

import React, { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { ActivityIndicator, Alert, Dimensions, Image, SafeAreaView, Share, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { RootStackScreenProps } from "../../domain/types/route.types";
import Animated, { interpolate, SlideInDown, useAnimatedRef, useAnimatedStyle, useScrollViewOffset } from "react-native-reanimated";
import Ionicons from 'react-native-vector-icons/Ionicons';

import Colors from "../../application/utils/constants/Color";
import { defaultStyles } from "../../application/utils/constants/Styles";
import ImagesCarousel from "../components/ImageCarousel";
import { useFavorites } from "../../application/providers/FavoritesContext";
import { UserProps } from "../../domain/interface/User.interface";
import { useAuth } from "../../application/providers/AuthContext";
import { useChat } from "../../application/providers/ChatContext";

const defaultProfile = require("../../presentation/assets/images/defautProfile.png")

const IMG_HEIGHT = 300;
const {width} = Dimensions.get('window');

// Assurez-vous que PostData inclut bien user.id, user.username, et user.avatar
// Exemple de structure attendue pour post.user dans PostData:
// user: {
//   id: string;
//   username: string;
//   avatar?: string;
// }

type Props = RootStackScreenProps<'Listing'> // Assurez-vous que 'Listing' est correct dans vos types de navigation


//Simplified Skeleton (vous pouvez garder votre skeleton existant)
const ListingSkeleton = () => {
  return (
    <View style={styles.container}>
        <View style={[styles.image, { backgroundColor: '#e0e0e0' }]} />
        <View style={styles.infoContainer}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <View style={{ width: '60%', height: 20, backgroundColor: '#e0e0e0' }} />
                <View style={{ width: '20%', height: 20, backgroundColor: '#e0e0e0' }} />
            </View>
            <View style={{ width: '80%', height: 18, backgroundColor: '#e0e0e0', marginBottom: 10 }} />
            <View style={{ width: '50%', height: 18, backgroundColor: '#e0e0e0', marginBottom: 10 }} />
            <View style={{ width: '40%', height: 20, backgroundColor: '#e0e0e0' }} />
            <View style={styles.divider} />
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <View style={{ width: 50, height: 50, borderRadius: 25, backgroundColor: '#e0e0e0' }} />
                <View>
                    <View style={{ width: '70%', height: 20, backgroundColor: '#e0e0e0', marginBottom: 5 }} />
                    <View style={{ width: '50%', height: 16, backgroundColor: '#e0e0e0' }} />
                </View>
            </View>
            <View style={styles.divider} />
            <View style={{ width: '90%', height: 80, backgroundColor: '#e0e0e0', marginTop: 10 }} />
        </View>
    </View>
  );
};

const Listing:React.FC<Props> = ({route, navigation}) => {
    const { post } = route.params; // post devrait être de type PostData
    // const [posts, setPosts] = useState<PostData>(post); // posts n'est pas utilisé, post l'est directement
    const { toggleFavorite, isFavorite } = useFavorites();
    const isFavorited = isFavorite(post.id!); // Utiliser post.id directement

    // Hooks pour le chat
    const { user: currentUser } = useAuth();
    const { findOrCreateChatWithUser, setCurrentChatIdAndReceiver } = useChat();
    const [isCreatingChat, setIsCreatingChat] = useState(false);
    

    const scrollRef = useAnimatedRef<Animated.ScrollView>();
    const scrollOffset = useScrollViewOffset(scrollRef);

    const shareListing = async () => {
        try {
          await Share.share({
            title: post.title,
            url: post.images[0]?.uri || 'https://example.com', // Fallback URL
            message: `${post.title} - Découvrez cette annonce ! ${post.images[0]?.uri || ''}`, // Message optionnel
          });
        } catch (err) {
          console.log(err);
          Alert.alert("Erreur", "Impossible de partager cette annonce pour le moment.");
        }
      };

    useLayoutEffect(() => {
        navigation.setOptions({
          headerTitle: '',
          headerTransparent: true,
          headerBackground: () => (
            <Animated.View style={[headerAnimatedStyle, styles.header]}></Animated.View>
          ),
          headerRight: () => (
            <View style={styles.bar}>
              <TouchableOpacity style={styles.roundButton} onPress={shareListing}>
                <Ionicons name="share-outline" size={22} color={'#000'} />
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => toggleFavorite(post)} // Utiliser post directement
                style={[styles.roundButton, {marginRight: 10}]}
              >
                <Ionicons 
                  name={isFavorited ? "heart" : "heart-outline"} 
                  size={22} color={isFavorited ? Colors.primary : "#000"} // Utiliser une couleur primaire pour favori
                />
              </TouchableOpacity>
            </View>
          ),
          headerLeft: () => (
            <TouchableOpacity style={[styles.roundButton, {marginLeft: 10}]} onPress={() => navigation.goBack()}>
              <Ionicons name="chevron-back" size={24} color={'#000'} />
            </TouchableOpacity>
          ),
        });
      }, [navigation, isFavorited, post, shareListing, toggleFavorite]); // Ajouter les dépendances
    
    const imageAnimatedStyle = useAnimatedStyle(() => {
        return {
            transform: [
                { translateY: interpolate(scrollOffset.value, [-IMG_HEIGHT, 0, IMG_HEIGHT], [-IMG_HEIGHT / 2, 0, IMG_HEIGHT * 0.75]) },
                { scale: interpolate(scrollOffset.value, [-IMG_HEIGHT, 0, IMG_HEIGHT], [2, 1, 1]) },
            ],
        };
    });

    const headerAnimatedStyle = useAnimatedStyle(() => {
        return {
          opacity: interpolate(scrollOffset.value, [0, IMG_HEIGHT / 1.5], [0, 1]),
        };
      }, []);

    
      const averageRating = post.reviews.length > 0
      ? parseFloat(
          (post.reviews.reduce((sum: number, review: any) => sum + review.rating, 0) / post.reviews.length).toFixed(1)
        )
      : 0;
    

    const handleNavigateToReviews = () => {
      if (post.id) {
          navigation.navigate('ReviewsWrapper', { postId: post.id }); // Assurez-vous que 'ReviewsWrapper' est correct
      } else {
          console.warn("Post ID is undefined, cannot navigate to reviews.");
          Alert.alert("Erreur", "Impossible d'afficher les avis pour ce post car son ID est manquant.");
      }
    };

    const handleSendMessage = async () => {
      console.log("Appui sur envoyer message", { currentUser, postUserId: post.user.id });
      if (!currentUser) {
        Alert.alert("Authentification requise", "Veuillez vous connecter pour envoyer un message.");
        return;
      }
      if (!post.user || !post.user.id) {
        Alert.alert("Erreur", "Impossible de contacter l'auteur de cette annonce.");
        return;
      }
      if (currentUser.user.id === post.user.id) {
        Alert.alert("Action impossible", "Vous ne pouvez pas vous envoyer de message à vous-même.");
        return;
      }
      setIsCreatingChat(true);
      try {
        const recipientProfile: UserProps = {
          id: post.user.id,
          username: post.user.username,
          avatar: post.user.avatar,
        };
        console.log("Création ou recherche du chat avec", recipientProfile);
        const chat = await findOrCreateChatWithUser(post.user.id, recipientProfile);
        console.log("Chat obtenu", chat);
    
        if (chat) {
          setCurrentChatIdAndReceiver(chat.id, chat.receiver);
          navigation.navigate('MessageScreen', {
            chatId: chat.id,
            userName: chat.receiver.username,
            userAvatar: chat.receiver.avatar || '',
            receiverId: chat.receiver.id,
          });
          //navigation.navigate('Tab', {screen: 'Inbox'})
        } else {
          Alert.alert("Erreur de chat", "Impossible de démarrer la conversation. Veuillez réessayer.");
        }
      } catch (error) {
        console.error("Erreur lors de la création ou de la recherche du chat:", error);
        Alert.alert("Erreur", "Une erreur s'est produite. Veuillez réessayer.");
      } finally {
        setIsCreatingChat(false);
      }
    };
    
    
    // Vérifier si les données du post sont chargées
    if (!post || !post.user) {
        // Afficher un skeleton ou un indicateur de chargement si les données ne sont pas encore prêtes
        // Ceci est un fallback, idéalement les données sont toujours passées correctement
        return <ListingSkeleton />;
    }
    
    return(
        <SafeAreaView style={styles.container}>
            <Animated.ScrollView
                contentContainerStyle={{ paddingBottom: 100 }}
                ref={scrollRef}
                scrollEventThrottle={16}
                showsVerticalScrollIndicator={false}
            >
                <ImagesCarousel images={post.images} stylesP={[styles.image, imageAnimatedStyle]}/>
                
                <View style={styles.infoContainer}>
                    <Text style={[styles.name, {color:Colors.grey}]}>{post.title}</Text>
                    <Text style={styles.location}>
                        {post.address} à {post.city}
                    </Text>
                    <Text style={styles.rooms}>
                        {post.bedroom} Chambres ·{' '}
                        {post.bathroom} Salle de bain
                    </Text>
                    <View style={styles.ratingContainer}>
                        <Ionicons name="star" size={16} color={Colors.grey} />
                        <Text style={styles.ratings}>
                            {`${averageRating !== 0 ? averageRating.toFixed(1) : 'N/A'}${post.reviews && post.reviews.length >= 0 ? ' · ' : ''}`}
                        </Text>
                        {post.reviews && post.reviews.length >= 0 && (
                            <TouchableOpacity onPress={handleNavigateToReviews}>
                                <Text style={[styles.ratings, styles.reviewLink]}>
                                    {`${post.reviews.length} avis`}
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>
                    <View style={styles.divider} />

                    <View style={styles.hostView}>
                        <Image source={post.user.avatar ? {uri :post.user.avatar} : defaultProfile} style={styles.host} />
                        <View>
                        <Text style={{ fontWeight: '500', fontSize: 16, color: Colors.grey, }}>Posté par {post.user.username}</Text>
                        </View>
                    </View>

                    <View style={styles.divider} />
                    <Text style={styles.description}>{post.desc}</Text>
                </View>
            </Animated.ScrollView>

            {/* Footer pour le prix et le bouton d'action */}
            <Animated.View style={defaultStyles.footer} entering={SlideInDown.delay(200)}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <TouchableOpacity style={styles.footerText}>
                        <Text style={styles.footerPrice}>DT{post.price}</Text>
                        <Text style={{fontFamily: 'Poppins-Medium'}}>/Mois</Text>
                    </TouchableOpacity>

                    {/* Bouton "Envoyer un message" */}
                    <TouchableOpacity 
                        style={[defaultStyles.btn, { paddingRight: 20, paddingLeft: 20 }, isCreatingChat ? styles.buttonDisabled : {}]}
                        onPress={handleSendMessage}
                        disabled={isCreatingChat || currentUser?.user.id === post.user.id} // Désactiver si création en cours ou si c'est son propre post
                    >
                        {isCreatingChat ? (
                            <ActivityIndicator size="small" color="#fff" />
                        ) : (
                            <Text style={defaultStyles.btnText}>
                                {currentUser?.user.id === post.user.id ? "Votre annonce" : "Envoyer un message"}
                            </Text>
                        )}
                    </TouchableOpacity>
                </View>
            </Animated.View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff"
    },
    image: {
        height: IMG_HEIGHT,
        width,
    },
    infoContainer: {
        padding: 24,
        backgroundColor: '#fff',
      },
      name: {
        fontSize: 26,
        fontFamily: 'Poppins-SemiBold',
      },
      location: {
        fontSize: 18,
        marginTop: 10,
        fontFamily: 'Poppins-SemiBold',
      },
      rooms: {
        fontSize: 16,
        color: Colors.grey,
        marginVertical: 4,
        fontFamily: 'Poppins-Medium',
      },
      ratings: { 
        fontSize: 16,
        fontFamily: 'Poppins-SemiBold',
        color: Colors.grey, 
      },
      ratingContainer: { 
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4, 
      },
      reviewLink: { 
        textDecorationLine: 'underline',
        color: Colors.primary, 
        fontFamily: 'Poppins-SemiBold', 
      },
      divider: {
        height: StyleSheet.hairlineWidth,
        backgroundColor: Colors.grey,
        marginVertical: 16,
      },
      host: {
        width: 50,
        height: 50,
        borderRadius: 50,
        backgroundColor: Colors.grey,
      },
      hostView: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
      },
      footerText: {
        height: '100%',
        justifyContent: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        color: Colors.grey,
      },
      footerPrice: {
        fontSize: 18,
        fontFamily: 'Poppins-SemiBold',
        color: Colors.grey,
      },
      roundButton: {
        width: 40,
        height: 40,
        borderRadius: 50,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        // color: Colors.primary, // color n'est pas une prop de style pour View/TouchableOpacity
        elevation: 2, // Pour Android
        shadowColor: '#000', // Pour iOS
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1,
      },
      bar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
      },
      header: {
        backgroundColor: '#fff',
        height: 70, // Ajustez selon la hauteur de votre header
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: Colors.grey,
      },
      description: {
        fontSize: 16,
        marginTop: 10,
        fontFamily: 'Poppins-Medium',
        lineHeight: 24, // Améliorer la lisibilité
        color: Colors.grey,
      },
      buttonDisabled: {
        backgroundColor: Colors.grey, // Ou une autre couleur pour indiquer l'état désactivé
      }
});

export default Listing;