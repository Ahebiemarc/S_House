import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View } from "react-native"
import { TabStackParamList } from "../../domain/types/route.types";
import Profile from "../../presentation/screens/tabs/Profile.screen";
import Wishlist from "../../presentation/screens/tabs/Wishlist.screen";
import Inbox from "../../presentation/screens/tabs/Inbox.scree";
import Explore from "../../presentation/screens/tabs/Explore.screen";
import Color from "../utils/constants/Color";
import Tips from "../../presentation/screens/tabs/Tips.screen";


const Tabs =  createBottomTabNavigator<TabStackParamList>()

const TabNavigator = () =>{
    return(
        <Tabs.Navigator>
            <Tabs.Group screenOptions={{headerShown: false, tabBarActiveTintColor: Color.primary}}>
                <Tabs.Screen name="Explore" component={Explore} options={{tabBarLabel: 'Explore'}} />
                <Tabs.Screen name="Wishlist" component={Wishlist} options={{tabBarLabel: 'Wishlist'}}/>
                <Tabs.Screen name="Tips" component={Tips} options={{tabBarLabel: 'Tips'}}/>

                <Tabs.Screen name="Inbox" component={Inbox} options={{tabBarLabel: 'Inbox'}} />
                <Tabs.Screen name="Profile" component={Profile} options={{tabBarLabel: 'Profile'}} />
            </Tabs.Group>
        </Tabs.Navigator>
    )
}

export default TabNavigator;