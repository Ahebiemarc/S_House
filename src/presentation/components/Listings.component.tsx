import React, { useEffect, useRef, useState } from "react";
import { FlatList, Image, ListRenderItem, StyleSheet, TouchableOpacity, View } from "react-native"
import { defaultStyles } from "../../application/utils/constants/Styles";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../domain/types/route.types";
import { useNavigation } from "@react-navigation/native";

interface Props {
    listings: any[];
    category: string;
}

type ExploreHeaderNavigationProp = StackNavigationProp<RootStackParamList, 'Tab'>;

const Listings: React.FC<Props> = ({listings: items, category}) => {

    const [loading, setLoaging] = useState(false);
    const [filteredItems, setFilteredItems] = useState<any[]>([]);
    const listRef = useRef<FlatList>(null);

    const navigation = useNavigation<ExploreHeaderNavigationProp>();


    useEffect(() => {
        console.log("Reloading Listings");
        setLoaging(true);
        setFilteredItems(items.filter(item => item.medium_url));
        setLoaging(false);
    }, [category, items]);

    const handleImageError = (item : any) => {
        setFilteredItems(currentItem => currentItem.filter(i => i !== item));
    }

    const renderRow: ListRenderItem<any> = ({item}) => (
        <TouchableOpacity activeOpacity={0.8} 
        onPress={() => navigation.navigate('Listing', {item})}
        >
            <View style={styles.listing}>
                <Image source={{uri: item.medium_url}} style={styles.image} 
                onError={() => handleImageError(item)}
                />
            </View>
        </TouchableOpacity>
    )

     return(
        <View style={defaultStyles.container}>
            <FlatList
                renderItem={renderRow}
                ref={listRef}
                keyExtractor={item => item.id}
                data={loading ? [] : filteredItems}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    listing:{
        padding: 16,
    },
    image: {
        width: '100%',
        height: 300,
        borderRadius: 10,
    },
    info: {
        textAlign: 'center',
        fontFamily: 'Poppins-SemiBold',
        fontSize: 16,
        marginTop: 4,
    },
})

export default Listings;