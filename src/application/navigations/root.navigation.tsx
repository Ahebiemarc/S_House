import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../domain/types/route.types";
import { View } from "react-native";
import TabNavigator from "./Tab.navigation";


const RootStack = createNativeStackNavigator<RootStackParamList>()

const RootNavigator = () => {
    return(
        <View style={{flex: 1}}>
            <RootStack.Navigator initialRouteName="Tab">
                <RootStack.Group screenOptions={{headerShown: false}}>
                    <RootStack.Screen name="Tab" component={TabNavigator} />
                </RootStack.Group>
            </RootStack.Navigator>
        </View>
    )
}

export default RootNavigator;