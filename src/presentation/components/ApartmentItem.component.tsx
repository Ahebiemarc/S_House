import { Image, TouchableOpacity, ViewStyle } from "react-native";
import { StyleSheet, Text, View } from "react-native";
import { truncateText } from "../../application/utils/functions/functions";



type Props = {
    listing: any;
    containerStyle?: ViewStyle
    Onpress?: (item: any) => void;
}

const defaultImage = "https://placeholder.com/180";


const ApartmentItem : React.FC<Props> = ({listing, containerStyle={}, Onpress}) =>{

    //const isNested = listing?.properties !== null;
    //const data = isNested ? listing.properties : listing

    const data = listing?.properties ?? listing ?? {};
    
    return(
        <View style={[styles.card, containerStyle]}>
            <TouchableOpacity style={{flexDirection: 'row', justifyContent: 'center', alignContent: 'center'}} activeOpacity={0.9} onPress={Onpress}>
            <Image source={{uri: data.medium_url || defaultImage}} style={styles.images} />
            <View style={styles.rightContainer}>
                <Text style={styles.title}>{truncateText(data.name, 30)}</Text>
                <Text style={styles.desc}>{truncateText(data.description, 30)}</Text>
                <View style={styles.footer}>
                    <Text style={styles.price}>DT {data.price} night </Text>
                    <Text style={styles.price}> ★ {data.review_scores_rating / 20} ({data.number_of_reviews})</Text>
                </View>
            </View>
            </TouchableOpacity>
            
        </View>
    )
    
 
};

const styles = StyleSheet.create({
    card :{
        backgroundColor: '#fff',
        borderRadius: 20,
        overflow: 'hidden',
    },
    images: {
        width: 150,
        aspectRatio: 1,
    },
    
    rightContainer: {
        flex:1,
        padding: 10,
    },
    title: {
        fontFamily: 'Poppins-Bold',
        marginBottom: 10,
        fontSize: 16,
    },
    desc: {
        fontFamily: 'Poppins-Regular',
        color: 'gray',
    },

    price: {
        fontFamily: 'Poppins-Bold',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        fontFamily: 'Poppins-Regular',
        marginTop: 'auto',

    }
});

export default ApartmentItem;