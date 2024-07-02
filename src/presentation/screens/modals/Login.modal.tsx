import { SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import { defaultStyles } from "../../../application/utils/constants/Styles";
import Colors from "../../../application/utils/constants/Color";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';



const Login = () =>{
    return (
        <View style={styles.container}>
            <TextInput
            autoCapitalize="none"
            placeholder="Email"
            style={[defaultStyles.inputField, { marginBottom: 30 }]}
           />
            <TextInput
            secureTextEntry
            autoCapitalize="none"
            placeholder="Password"
            style={[defaultStyles.inputField, { marginBottom: 30 }]}

            />

        <TouchableOpacity style={defaultStyles.btn}>
            <Text style={defaultStyles.btnText}>Continue</Text>
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
            <TouchableOpacity style={styles.btnOutline}>
            <MaterialCommunityIcons name="message-badge" size={24} style={defaultStyles.btnIcon} />
            <Text style={styles.btnOutlineText}>Continue with Phone</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.btnOutline} onPress={() => {}}>
            <MaterialCommunityIcons name="apple" size={24} style={defaultStyles.btnIcon} />
            <Text style={styles.btnOutlineText}>Continue with Apple</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.btnOutline} onPress={() => {}}>
            <MaterialCommunityIcons name="google" size={24} style={defaultStyles.btnIcon} />
            <Text style={styles.btnOutlineText}>Continue with Google</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.btnOutline} onPress={() => {}}>
            <MaterialCommunityIcons name="facebook" size={24} style={defaultStyles.btnIcon} />
            <Text style={styles.btnOutlineText}>Continue with Facebook</Text>
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