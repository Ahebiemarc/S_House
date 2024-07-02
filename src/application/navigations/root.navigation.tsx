
import { createStackNavigator, TransitionPresets } from "@react-navigation/stack";
import { RootStackParamList, RootStackScreenProps, TabStackScreenProps } from "../../domain/types/route.types";
import { View, Dimensions, TouchableOpacity } from "react-native";
import TabNavigator from "./Tab.navigation";
import Login from "../../presentation/screens/modals/Login.modal";
import Booking from "../../presentation/screens/modals/Booking.modal";
import Listing from "../../presentation/screens/Listing.screen";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useRoute } from "@react-navigation/native";

const {height, width} = Dimensions.get('window');

const RootStack = createStackNavigator<RootStackParamList>()

const RootNavigator = () => {
    return(
        <View style={{flex: 1}}>
            <RootStack.Navigator initialRouteName="Tab">
                <RootStack.Group screenOptions={{headerShown: false}}>
                    <RootStack.Screen name="Tab" component={TabNavigator} />
                    <RootStack.Screen name="Listing" component={Listing}/>
                </RootStack.Group>
                <RootStack.Group 
                    screenOptions={({navigation}) => ({
                        presentation: 'modal', 
                        headerShown: true,
                        headerStyle:{
                            backgroundColor: 'transparent',
                        },
                        //headerTintColor: 'white',
                        gestureEnabled: true,
                        ...TransitionPresets.ModalPresentationIOS,
                        headerLeft: () =>(
                            <TouchableOpacity activeOpacity={0.7} style={{marginLeft: 10}} onPress={() => navigation.goBack()}>
                                <Ionicons name="close-outline" size={35} />
                            </TouchableOpacity>
                        )
                    })}
                >
                    <RootStack.Screen name="Login" component={Login}
                        options={{
                            headerTitle: 'S\'inscrire ou se connecter',
                            headerTitleStyle: {
                                textAlign: 'center',
                                marginLeft: width * 0.11,
                                fontFamily: 'Poppins-Medium',
                                fontSize: 18
                            }

                        }}
                        
                    />
                    
                </RootStack.Group>

                {/*Booking*/}
                <RootStack.Group 
                    screenOptions={({navigation}) => ({
                        presentation: 'transparentModal',
                        animation: 'fade',
                        headerShown: true,
                        headerStyle:{
                            backgroundColor: 'transparent',
                        },
                        //headerTintColor: 'transparent',
                        gestureEnabled: true,
                        ...TransitionPresets.ModalPresentationIOS,
                        headerLeft: () =>(
                            <TouchableOpacity activeOpacity={0.7} style={{marginLeft: 10}} onPress={() => navigation.goBack()}>
                                <Ionicons name="close-outline" size={35} />
                            </TouchableOpacity>
                        )
                    })}
                >

                <RootStack.Screen name="Booking" component={Booking}
                        options={{
                            headerTitle: '',
                            headerTitleStyle: {
                                textAlign: 'center',
                                marginLeft: width * 0.11,
                                fontFamily: 'Poppins-Medium',
                                fontSize: 18
                            }
                        }}
                    />
                </RootStack.Group>
            </RootStack.Navigator>
        </View>
    )
}

export default RootNavigator;