import {SafeAreaView, Text, TouchableOpacity, View } from "react-native"
import Button from "../../components/Button.component";
import { TabStackScreenProps } from "../../../domain/types/route.types";
import React from "react";



type Props = TabStackScreenProps<'Profile'>
const Profile: React.FC<Props> = ({navigation}) => {
    return(
        <SafeAreaView style={{flex:1, justifyContent:'center',alignItems: 'center'}}>
            <Button title="Sign In" onPress={()=> navigation.navigate('Login')} />
            <Button title="Sign Out" />

        </SafeAreaView>
    )
}

export default Profile;