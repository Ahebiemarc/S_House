import { ActivityIndicator, Alert, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import { defaultStyles } from "../../../application/utils/constants/Styles";
import Colors from "../../../application/utils/constants/Color";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../../domain/types/route.types";
import { useState } from "react";
import { useAuth } from "../../../application/hooks/useAuth";



const Login = () =>{
    const [username, setUesername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();


    const handleLogin = async () => {
        if (!username || !password) {
          Alert.alert('Erreur', 'Veuillez remplir tous les champs.');
          return;
        }
        setLoading(true);
        await  login(username, password);
        setLoading(false);
        navigation.navigate('Tab', {screen: 'Explore'})
      };
    
    return (
        <View style={styles.container}>
            <TextInput
            autoCapitalize="none"
            placeholder="Username"
            value={username}
            onChangeText={setUesername}
            placeholderTextColor={Colors.gray}
            style={[defaultStyles.inputField, { marginBottom: 30, color: "#000"  }]}
           />
            <TextInput
            secureTextEntry
            autoCapitalize="none"
            placeholder="Password"
            value={password}
            placeholderTextColor={Colors.gray}
            onChangeText={setPassword}
            style={[defaultStyles.inputField, { marginBottom: 30, color: "#000" }]}

            />

        <TouchableOpacity style={defaultStyles.btn} onPress={handleLogin}>
            {loading ? (
            <ActivityIndicator color={Colors.white} />
          ) : (
            <Text style={defaultStyles.btnText}>Se connecter</Text>
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
            <TouchableOpacity style={styles.btnOutline} onPress={() => navigation.navigate('Signup')}>
            <MaterialCommunityIcons name="login" size={24} style={defaultStyles.btnIcon} />
            <Text style={styles.btnOutlineText}>S'inscrire maintenant</Text>
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

export default Login;