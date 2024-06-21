import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { CompositeScreenProps, NavigatorScreenParams } from "@react-navigation/native"
import { NativeStackScreenProps } from "@react-navigation/native-stack";

// définition des paramètres de route possibles pour la pile racine de  l'application
export type RootStackParamList = {
    Tab: NavigatorScreenParams<TabParamList>;
    splash: undefined;
    Onboarding: undefined;
    Login: undefined;
    Signup: undefined;
    Details: undefined;

}


export type RootStackScreenProps<T extends keyof RootStackParamList> = NativeStackScreenProps<RootStackParamList, T>;

export type TabParamList = {
    Home: undefined;
    Profile: undefined;
}


export type TabScreenProps<T extends keyof TabParamList> = CompositeScreenProps<BottomTabScreenProps<TabParamList, T>, RootStackScreenProps<keyof RootStackParamList>>


declare global {
    namespace ReactNavigation {
        interface RootParamList extends RootStackParamList{}
    }
}