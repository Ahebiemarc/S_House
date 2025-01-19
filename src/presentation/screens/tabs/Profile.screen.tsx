import {Button, Image, ImageProps, ImageSourcePropType, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import * as Btn  from "../../components/Button.component";
import { TabStackScreenProps } from "../../../domain/types/route.types";
import React, { useEffect, useState } from "react";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { defaultStyles } from "../../../application/utils/constants/Styles";
import Colors from "../../../application/utils/constants/Color";
import AddBtnListing from "../../components/AddBtnListing.component";
import { images } from "../../../application/utils/constants/assets";


type Props = TabStackScreenProps<'Profile'>

const Profile: React.FC<Props> = ({navigation}) => {
    const [username, setUesername] = useState<string>('Ahebié Markus');
    const [email, setEmail] = useState<string>('ahebiemarc22@gmail.com');
    const [photo, setPhoto] = useState<ImageProps>(require('../../../presentation/assets/images/4.jpg'));
    const [listPost, setListPost] = useState<Array<any>>(images);

    const [edit, setEdit] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // Fetch user data
        
        setUesername(username);
        setEmail(email);
        setListPost(listPost);
    }, [username, email, listPost ]);

    const onSaveUser = async () =>{
        setEdit(false);
    };

    const onCaptureImage = async () =>{
        // Capture image using camera
        // Set photo to captured image
    }

    return(
        <SafeAreaView style={defaultStyles.container}>
            
            <View style={styles.headerContainer}>
                <Text style={styles.header} >Profile</Text>
                <Ionicons name="notifications-outline" size={26} color="#000" />
                
            </View>

            {username && (
                <View style={styles.card}>
                    <TouchableOpacity activeOpacity={0.8} onPress={onCaptureImage} >
                        <Image source={photo} style={styles.avatar} />
                    </TouchableOpacity>
                    <View style={{flexDirection: 'row', gap:6}}>
                        {edit ? (
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
                        ) : (
                            <View style={styles.editRow}>
                                <Text style={{fontFamily:'Poppins-Bold', fontSize:22}}>{username}</Text>
                                <TouchableOpacity onPress={()=> setEdit(true)}>
                                    <Ionicons name="create-outline" size={24} color={Colors.dark} />
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                    <Text style={{fontFamily:'Poppins-Regular', fontSize:16, color:Colors.grey}}>{email}</Text>
                </View>
            )}

            <View style={{
                alignItems: 'center',
            }}>
                {/*<Btn.Button title="Sign In" onPress={()=> navigation.navigate('Login')} />*/}
                <Btn.Button title="Sign Out" />
            </View>

            <View style={{justifyContent: 'center', padding: 20,}}>
                <AddBtnListing data={images} />
                <TouchableOpacity style={{flexDirection:'row', alignSelf: 'center', marginVertical: 20}}>
                    <Text style={{fontFamily: 'Poppins-SemiBold', fontSize:18, color: Colors.primary ,marginHorizontal: 5}}>Add news</Text>
                    <Ionicons name="add" size={24} color={Colors.primary} />
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
})

export default Profile;