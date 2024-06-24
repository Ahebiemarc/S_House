import React from "react";
import { Button, SafeAreaView, Text, TouchableOpacity, View } from "react-native"
import {TabStackScreenProps } from "../../../domain/types/route.types";

type Props = TabStackScreenProps<'Explore'>
const Explore: React.FC<Props> = ({navigation}) => {
    return(
        <SafeAreaView>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text>Booking</Text>
            </TouchableOpacity>   
            <TouchableOpacity onPress={() => navigation.navigate('Listing', {id: '1337'})}>
                <Text>Booking</Text>
            </TouchableOpacity>          
        </SafeAreaView>
    )
}

export default Explore;