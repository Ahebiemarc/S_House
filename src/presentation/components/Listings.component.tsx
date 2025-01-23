import React, { useEffect, useRef, useState } from "react";
import { FlatList, Image, ListRenderItem, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { defaultStyles } from "../../application/utils/constants/Styles";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../domain/types/route.types";
import { useNavigation } from "@react-navigation/native";
import Ionicons from 'react-native-vector-icons/Ionicons';
import Animated, { FadeInRight, FadeOutLeft } from "react-native-reanimated";
import { formatText } from "../../application/utils/functions/functions";


interface Props {
    listings: any[];
    category: string;
}

type ExploreHeaderNavigationProp = StackNavigationProp<RootStackParamList, 'Tab'>;




const Listings: React.FC<Props> = ({listings: items, category}) => {

    const [loading, setLoading] = useState(false);
    const [filteredItems, setFilteredItems] = useState<any[]>([]);
    const listRef = useRef<FlatList>(null);

    const navigation = useNavigation<ExploreHeaderNavigationProp>();



    useEffect(() => {
        console.log("Reloading Listings");
        setLoading(true);
        setFilteredItems(items.filter(item => item.medium_url));
        setTimeout(() => {
            setLoading(false);
          }, 200);
        //setLoading(false);
    }, [category, items]);

    const handleImageError = (item : any) => {
        setFilteredItems(currentItem => currentItem.filter(i => i !== item));
    }

    const renderRow: ListRenderItem<any> = ({item}) => (
        <TouchableOpacity activeOpacity={0.8} 
        onPress={() => navigation.navigate('Listing', {item})}
        >
            <Animated.View style={styles.listing} entering={FadeInRight} exiting={FadeOutLeft}>
                <Animated.Image source={{uri: item.medium_url}} style={styles.image} 
                onError={() => handleImageError(item)}
                />
                <TouchableOpacity style={{position: 'absolute', right: 30, top: 30, backgroundColor: "#fff", borderRadius: 30 ,padding: 5}}>
                    <Ionicons name="heart-outline" size={24} color="#000"/>
                </TouchableOpacity>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                    <Text style={{fontSize:16, fontFamily: 'Poppins-Bold'}}>{formatText(item.name)}</Text>
                    <View style={{ flexDirection: 'row', gap: 4,  }}>
                        <Ionicons name="star" size={16} style={{marginTop: 1}} />
                        <Text style={{fontFamily: 'Poppins-Bold',}}> {item.review_scores_rating / 20} </Text>
                    </View>
                </View>
                <Text style={{ fontFamily: 'Poppins-Medium' }}>{item.room_type}</Text>
                <View style={{ flexDirection: 'row', gap: 4 }}>
                    <Text style={{ fontFamily: 'Poppins-Bold' }}>DT {item.price}</Text>
                    <Text style={{ fontFamily: 'Poppins-Medium' }}>Month</Text>
                </View>
            </Animated.View>
        </TouchableOpacity>
    )

     return(
        <View style={defaultStyles.container}>
            <FlatList
                renderItem={renderRow}
                ref={listRef}
                keyExtractor={item => item.id}
                data={loading ? [] : filteredItems}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    listing:{
        padding: 16,
        gap: 10,
        marginVertical: 16,
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