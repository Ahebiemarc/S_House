import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { CompositeScreenProps, NavigatorScreenParams } from "@react-navigation/native"
import { StackScreenProps } from "@react-navigation/stack";

// définition des paramètres de route possibles pour la pile racine de  l'application
export type RootStackParamList = {
    Tab: NavigatorScreenParams<TabStackParamList>;
    splash: undefined;
    Onboarding: undefined;
    Login: undefined;
    Booking: undefined;
    Listing: {item: any};
    Map: {item: any};

}


export type RootStackScreenProps<T extends keyof RootStackParamList> = StackScreenProps<RootStackParamList, T>;

export type TabStackParamList = {
    Tips: undefined;
    Profile: undefined;
    Wishlist: undefined;
    Inbox: undefined;
    Explore: undefined;
}


export type TabStackScreenProps<T extends keyof TabStackParamList> = CompositeScreenProps<BottomTabScreenProps<TabStackParamList, T>, RootStackScreenProps<keyof RootStackParamList>>


declare global {
    namespace ReactNavigation {
        interface RootParamList extends RootStackParamList{}
    }
}