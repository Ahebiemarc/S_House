import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View } from "react-native"
import { TabStackParamList } from "../../domain/types/route.types";
import Profile from "../../presentation/screens/tabs/Profile.screen";
import Wishlist from "../../presentation/screens/tabs/Wishlist.screen";
import Inbox from "../../presentation/screens/tabs/Inbox.screen";
import Explore from "../../presentation/screens/tabs/Explore.screen";
import Color from "../utils/constants/Color";
import Tips from "../../presentation/screens/tabs/Tips.screen";
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';



const Tabs =  createBottomTabNavigator<TabStackParamList>()

const TabNavigator = () =>{
    return(
        <Tabs.Navigator>
            <Tabs.Group 
                screenOptions={{
                    headerShown: false, 
                    tabBarActiveTintColor: Color.primary,
                    tabBarLabelStyle:{
                        fontFamily: 'Poppins-semiBold',
                        //fontSize: 14
                    }
                    }}>
                <Tabs.Screen name="Explore" component={Explore} 
                options={{
                    tabBarLabel: 'Explore',
                    tabBarIcon: ({color, size}) =>(
                        <MaterialCommunityIcons name="home-search-outline" color={color} size={size} />
                    )
                }} 
                />
                <Tabs.Screen name="Wishlist" component={Wishlist} 
                options={{
                    tabBarLabel: 'Wishlist',
                    tabBarIcon: ({color, size}) =>(
                        <Ionicons name="heart-outline" color={color} size={size} />
                    )
                }}
                />
                <Tabs.Screen name="Tips" component={Tips} 
                    options={{
                        tabBarLabel: 'Tips',
                        tabBarIcon: ({color, size}) =>(
                            <MaterialCommunityIcons name="lightbulb-outline" color={color} size={size} />
                        )
                    }}
                />

                <Tabs.Screen name="Inbox" component={Inbox} 
                    options={{
                        tabBarLabel: 'Inbox',
                        tabBarIcon: ({color, size}) =>(
                            <MaterialCommunityIcons name="message-outline" color={color} size={size} />
                        )

                    }} 
                />
                <Tabs.Screen name="Profile" component={Profile} 
                    options={{
                        tabBarLabel: 'Profile',
                        tabBarIcon: ({color, size}) =>(
                            <Ionicons name="person-circle-outline" color={color} size={size} />
                        )
                    }} 
                />
            </Tabs.Group>
        </Tabs.Navigator>
    )
}

export default TabNavigator;