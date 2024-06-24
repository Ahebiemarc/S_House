import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { CompositeScreenProps, NavigatorScreenParams } from "@react-navigation/native"
import { NativeStackScreenProps } from "@react-navigation/native-stack";

// définition des paramètres de route possibles pour la pile racine de  l'application
export type RootStackParamList = {
    Tab: NavigatorScreenParams<TabStackParamList>;
    splash: undefined;
    Onboarding: undefined;
    Login: undefined;
    Signup: undefined;
    Details: undefined;

}


export type RootStackScreenProps<T extends keyof RootStackParamList> = NativeStackScreenProps<RootStackParamList, T>;

export type TabStackParamList = {
    Tips: undefined;
    Profile: undefined;
    Wishlist: undefined;
    Inbox: undefined;
    Explore: undefined;
}


export type TabScreenProps<T extends keyof TabStackParamList> = CompositeScreenProps<BottomTabScreenProps<TabStackParamList, T>, RootStackScreenProps<keyof RootStackParamList>>


declare global {
    namespace ReactNavigation {
        interface RootParamList extends RootStackParamList{}
    }
}