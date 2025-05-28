import {Image, ListRenderItem, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { TabStackScreenProps } from "../../../domain/types/route.types";
import React, { useEffect, useMemo, useState } from "react";
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { defaultStyles } from "../../../application/utils/constants/Styles";
import Colors from "../../../application/utils/constants/Color";
import ApartmentItem from "../../components/ApartmentItem.component";
import ProtectedRoute from "../../../application/routes/Protected.route";
import { useAuth } from "../../../application/providers/AuthContext";
import { Alert } from "react-native";
import { UserProvider, useUser } from "../../../application/providers/UserContext";


const defautProfile = require('../../../presentation/assets/images/defautProfile.png');




type Props = TabStackScreenProps<'Profile'>

const Profile: React.FC<Props> = ({navigation}) => {


    const { logout, user: authUser } = useAuth(); // authUser peut être légèrement obsolète après une màj via UserProvider
    const { currentUser } = useUser(); // << Utilise currentUser de UserProvider pour l'affichage    console.log(user?.user);

    const displayUser = currentUser?.user || authUser?.user;

    const handleLogout = () => {
         Alert.alert(
             "Déconnexion", // Title
             "Êtes-vous sûr de vouloir vous déconnecter ?",
             [
                 {
                     text: "Annuler",
                     style: "cancel"
                 },
                 {
                     text: "Déconnexion",
                     onPress: () => {
                         logout();
                     },
                     style: "destructive"
                 }
             ]
         );
      };



    return(
        <SafeAreaView style={defaultStyles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.header} >Profile</Text>
                <Ionicons name="notifications-outline" size={26} color="#000" />
                
            </View>

            {displayUser && (
                <View style={styles.card}>
                    <TouchableOpacity activeOpacity={0.8}  >
                        <Image source={displayUser.avatar ? {uri: displayUser.avatar} : defautProfile } style={styles.avatar} />
                    </TouchableOpacity>
                    <View style={{flexDirection: 'row', gap:6}}>
                            <View style={styles.editRow}>
                                <Text style={{fontFamily:'Poppins-Bold', fontSize:22}}>{displayUser.username}</Text>
                                <TouchableOpacity onPress={() => navigation.navigate('UpdateProfile')}>
                                    <Ionicons name="create-outline" size={24} color={Colors.dark} />
                                </TouchableOpacity>
                            </View>
                        
                    </View>
                    <Text style={{fontFamily:'Poppins-Regular', fontSize:16, color:Colors.grey}}>{displayUser.email}</Text>
                </View>
            )}

            

            <View style={{justifyContent: 'center', padding: 20,}}>
                <TouchableOpacity style={{flexDirection:'row', alignSelf: 'flex-end', marginVertical: 20, justifyContent: 'center',}} onPress={() => navigation.navigate('DetailsAddPost' , {})}>
                    <Text style={{fontFamily: 'Poppins-SemiBold', fontSize:18, color: Colors.primary ,marginHorizontal: 5}}>Ajouter </Text>
                    <Ionicons name="add" size={24} color={Colors.primary} />
                </TouchableOpacity>
                <TouchableOpacity style={{flexDirection:'row', alignSelf: 'flex-end', marginVertical: 0, justifyContent: 'center', }} onPress={handleLogout}>
                    <Text style={{fontFamily: 'Poppins-SemiBold', fontSize:18, color: Colors.primary, marginHorizontal: 5,textAlign: 'center' }}>Déconnexion</Text>
                    <MaterialCommunityIcons name="logout" size={24} color={Colors.primary} />
                </TouchableOpacity>
                <TouchableOpacity style={{flexDirection:'row', alignSelf: 'flex-end', marginVertical: 20, justifyContent: 'center', }}  onPress={() => navigation.navigate('MyListHouse')}>
                    <Text style={{fontFamily: 'Poppins-SemiBold', fontSize:18, color: Colors.primary, marginHorizontal: 5,textAlign: 'center' }}>Mes maisons</Text>
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


