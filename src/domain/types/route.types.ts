import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { CompositeScreenProps, NavigatorScreenParams } from "@react-navigation/native"
import { StackScreenProps } from "@react-navigation/stack";
import { Message } from "../interface/Message.interface";
import { PostData } from "../interface/Post.interface";



// ⬇️ D'abord ton SharedElementStack bien typé
export type SharedElementStackParamList = {
    DetailsAddPost: undefined;
    LocationAddPost: undefined;
    MapAddPost: undefined;
};

// définition des paramètres de route possibles pour la pile racine de  l'application
export type RootStackParamList = {
    Tab: NavigatorScreenParams<TabStackParamList>;
    splash: undefined;
    Onboarding: undefined;
    Login: undefined;
    Signup: undefined;
    MyApartmentList: undefined;
    Booking: undefined;
    Listing: {post: PostData};
    Map: {items: any};
    DetailsAddPost: { postId?: string };
    LocationAddPost: { postId?: string };
    MapAddPost: { postId?: string };
    MessageScreen: {
        chatId: string,
        userName: string,
        userAvatar: string,
        //initialMessages: Message[];
        receiverId: string;
    };
    //SharedElementStack: NavigatorScreenParams<SharedElementStackParamList>;
    MyListHouse: undefined
    ReviewsWrapper: { postId: string }; // Écran wrapper pour le provider
    AddReview: { postId: string };
    UpdateProfile: undefined;


}


export type RootStackScreenProps<T extends keyof RootStackParamList> = StackScreenProps<RootStackParamList, T>;

export type TabStackParamList = {
    Tips: undefined;
    Profile: undefined;
    Wishlist: undefined;
    Inbox: undefined;
    Explore: { refresh: boolean } | undefined;
}


export type TabStackScreenProps<T extends keyof TabStackParamList> = CompositeScreenProps<BottomTabScreenProps<TabStackParamList, T>, RootStackScreenProps<keyof RootStackParamList>>


declare global {
    namespace ReactNavigation {
        interface RootParamList extends RootStackParamList{}
    }
}