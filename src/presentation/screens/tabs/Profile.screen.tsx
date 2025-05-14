import {Image, ImageSourcePropType, ListRenderItem, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import * as Btn  from "../../components/Button.component";
import { TabStackScreenProps } from "../../../domain/types/route.types";
import React, { useEffect, useMemo, useState } from "react";
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { defaultStyles } from "../../../application/utils/constants/Styles";
import Colors from "../../../application/utils/constants/Color";
import listingsData from '../../assets/data/airbnb-listings.json';
import ApartmentItem from "../../components/ApartmentItem.component";
import ProtectedRoute from "../../../application/routes/Protected.route";
import { useAuth } from "../../../application/hooks/useAuth";
import { Alert } from "react-native";
import { UserPost } from "../MylistHouse.screen";


const defautProfile = require('../../../presentation/assets/images/defautProfile.png');




// Données initiales des posts favoris
const INITIAL_USER_POSTS: UserPost[] = [
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



type Props = TabStackScreenProps<'Profile'>

const Profile: React.FC<Props> = ({navigation}) => {

    //const [listPost, setListPost] = useState<Array<any>>(images);

    const items = useMemo(() => listingsData as any, []);    
    const [edit, setEdit] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState(false);
    const { logout, user } = useAuth();
    console.log(user?.user);
    

    const snapPoints = useMemo(() => ['25%', '50%', '90%'], []);
    


    /*useEffect(() => {

        setListPost(listPost);
    }, [listPost ]);*/

    const handleLogout = () => {
        // Add confirmation alert
         Alert.alert(
             "Déconnexion", // Title
             "Êtes-vous sûr de vouloir vous déconnecter ?", // Message
             [
                 {
                     text: "Annuler",
                     style: "cancel"
                 },
                 {
                     text: "Déconnexion",
                     onPress: () => {
                         logout();
                         // Navigation handled by RootLayoutNav effect
                     },
                     style: "destructive" // Red color for logout action on iOS
                 }
             ]
         );
      };




    const renderItem : ListRenderItem<any> = ({item}) => {
        //console.log(item);
        //console.log(1);
        
        
        return(
            <ApartmentItem listing={item} />
        )
    }


    return(
        <SafeAreaView style={defaultStyles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.header} >Profile</Text>
                <Ionicons name="notifications-outline" size={26} color="#000" />
                
            </View>

            {user?.user && (
                <View style={styles.card}>
                    <TouchableOpacity activeOpacity={0.8}  >
                        <Image source={user?.user.avatar ? {uri: user?.user.avatar} : defautProfile } style={styles.avatar} />
                    </TouchableOpacity>
                    <View style={{flexDirection: 'row', gap:6}}>
                        {/*edit ? (
                            <View style={styles.editRow}>
                                <TextInput
                                    placeholder="First Name"
                                    value={username || ''}
                                    onChangeText={setUesername}
                                    style={[defaultStyles.inputField, { width: 100 }]}
                               />
                                <TextInput
                                    placeholder="Last Name"
                                    value={email || ''}
                                    onChangeText={setEmail}
                                    style={[defaultStyles.inputField, { width: 100 }]}
                                />
                                <TouchableOpacity onPress={onSaveUser} style={[{borderRadius: 5, borderWidth: 1}]}>
                                        <Ionicons name="checkmark-outline" size={24} color={Colors.dark} />
                                </TouchableOpacity>
                            </View>
                        ) : */}
                            <View style={styles.editRow}>
                                <Text style={{fontFamily:'Poppins-Bold', fontSize:22}}>{user?.user.username}</Text>
                                <TouchableOpacity onPress={()=> setEdit(true)}>
                                    <Ionicons name="create-outline" size={24} color={Colors.dark} />
                                </TouchableOpacity>
                            </View>
                        
                    </View>
                    <Text style={{fontFamily:'Poppins-Regular', fontSize:16, color:Colors.grey}}>{user?.user.email}</Text>
                </View>
            )}

            

            <View style={{justifyContent: 'center', padding: 20,}}>
                {/*<AddBtnListing data={listPost} />*/}
                <TouchableOpacity style={{flexDirection:'row', alignSelf: 'flex-end', marginVertical: 20, justifyContent: 'center',}} onPress={() => navigation.navigate('DetailsAddPost')}>
                    <Text style={{fontFamily: 'Poppins-SemiBold', fontSize:18, color: Colors.primary ,marginHorizontal: 5}}>Ajouter </Text>
                    <Ionicons name="add" size={24} color={Colors.primary} />
                </TouchableOpacity>
                <TouchableOpacity style={{flexDirection:'row', alignSelf: 'flex-end', marginVertical: 0, justifyContent: 'center', }} onPress={handleLogout}>
                    <Text style={{fontFamily: 'Poppins-SemiBold', fontSize:18, color: Colors.primary, marginHorizontal: 5,textAlign: 'center' }}>Déconnexion</Text>
                    <MaterialCommunityIcons name="logout" size={24} color={Colors.primary} />
                </TouchableOpacity>
                <TouchableOpacity style={{flexDirection:'row', alignSelf: 'flex-end', marginVertical: 20, justifyContent: 'center', }}  onPress={() => navigation.navigate('MyListHouse', {items: INITIAL_USER_POSTS})}>
                    <Text style={{fontFamily: 'Poppins-SemiBold', fontSize:18, color: Colors.primary, marginHorizontal: 5,textAlign: 'center' }}>Voir mes maisons</Text>
                    <MaterialCommunityIcons name="eye" size={24} color={Colors.primary} />
                </TouchableOpacity>
            </View>

   
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    headerContainer:{
        flexDirection:'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding:24,

    },
    header:{
        fontFamily: 'Poppins-SemiBold',
        fontSize:24,
        color:'#000'
    },
    card: {
        backgroundColor: '#fff',
        padding: 24,
        borderRadius: 16,
        marginHorizontal: 24,
        marginTop: 24,
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 6,
        shadowOffset: {
          width: 1,
          height: 2,
        },
        alignItems: 'center',
        gap: 14,
        marginBottom: 24,
    },

    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: Colors.grey,
    },
    editRow: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    contentContainer: {
        flex: 1,
    },
    listTitle: {
        textAlign: 'center',
        fontFamily: 'Poppins-SemiBold',
        fontSize: 16,
        marginVertical: 5,
        marginBottom: 15,
    },
    flatListContentContainer: {
        gap: 10,
        padding: 10,
    
    },
})



export default function ProtectedProfile(props: Props) {
    return (
      <ProtectedRoute>
        <Profile {...props} />
      </ProtectedRoute>
    );
}


