import { ActivityIndicator, Alert, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import { defaultStyles } from "../../../application/utils/constants/Styles";
import Colors from "../../../application/utils/constants/Color";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../../domain/types/route.types";
import { useState } from "react";
import { useAuth } from "../../../application/hooks/useAuth";



const SignUp = () =>{
    const [username, setUesername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();

    const handleRegister = async () => {
        if (!username || !password || !email) {
            Alert.alert('Erreur', 'Veuillez remplir tous les champs.');
            return;
        }
        setLoading(true);
        await  register(username, email, password); 
 
        setLoading(false);
        navigation.navigate('Login')
    };

    
    return (
        <View style={styles.container}>
            <TextInput
            autoCapitalize="none"
            placeholder="Username"
            placeholderTextColor={Colors.gray}
            value={username}
            onChangeText={setUesername}
            style={[defaultStyles.inputField, { marginBottom: 30, color: "#000" }]}
           />
            <TextInput
            autoCapitalize="none"
            placeholder="Email"
            placeholderTextColor={Colors.gray}
            value={email}
            onChangeText={setEmail}
            style={[defaultStyles.inputField, { marginBottom: 30, color: "#000" }]}
           />
            <TextInput
            secureTextEntry
            autoCapitalize="none"
            placeholder="Password"
            placeholderTextColor={Colors.gray}
            value={password}
            onChangeText={setPassword}
            style={[defaultStyles.inputField, { marginBottom: 30 , color: "#000"}]}

            />

        <TouchableOpacity style={defaultStyles.btn} onPress={handleRegister}>
            {loading ? (
                        <ActivityIndicator color={Colors.white} />
                      ) : (
                        <Text style={defaultStyles.btnText}>S'inscrire</Text>
                      )}
        </TouchableOpacity>

        <View style={styles.seperatorView}>
            <View
            style={{
                flex: 1,
                borderBottomColor: 'black',
                borderBottomWidth: StyleSheet.hairlineWidth,
            }}
            />
            <Text style={styles.seperator}>or</Text>
            <View
            style={{
                flex: 1,
                borderBottomColor: 'black',
                borderBottomWidth: StyleSheet.hairlineWidth,
            }}
            />
        </View>

        <View style={{ gap: 20 }}>
            <TouchableOpacity style={styles.btnOutline} onPress={() => navigation.navigate('Login')}>
            <MaterialCommunityIcons name="login" size={24} style={defaultStyles.btnIcon} />
            <Text style={styles.btnOutlineText}>Se connecter</Text>
            </TouchableOpacity>
        </View>

       </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 26,
    },
    seperatorView: {
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center',
        marginVertical: 30,
      },
      seperator: {
        fontFamily: 'Poppins-Regular',
        color: Colors.grey,
        fontSize: 16,
      },
      btnOutline: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: Colors.grey,
        height: 50,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        paddingHorizontal: 10,
      },
      btnOutlineText: {
        color: '#000',
        fontSize: 16,
        fontFamily: 'Poppins-Regular',
      },
})

export default SignUp;