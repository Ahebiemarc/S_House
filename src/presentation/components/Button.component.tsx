import React from "react"
import { StyleSheet, Text, TouchableOpacity } from "react-native"

import  Colors from "../../application/utils/constants/Color.ts"

type Props = {
    title: string,
    onPress?: () => void
}
export const Button: React.FC<Props> = ({title, onPress}) => {
    return (
        <TouchableOpacity style={styles.button} activeOpacity={0.8} onPress={onPress}>
            <Text style={styles.title}> {title} </Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button: {
        padding: 10,
        backgroundColor: Colors.primary,
        borderRadius: 5,
        //color: 'white',
        width: 120,
        margin: 8,
    },
    title:{
        fontFamily: 'Poppins-Medium',
        color: 'white',
        fontSize: 16,
        textAlign: 'center'

    }
})
