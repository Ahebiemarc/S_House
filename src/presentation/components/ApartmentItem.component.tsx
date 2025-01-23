import { Image } from "react-native";
import { StyleSheet, Text, View } from "react-native";
import { truncateText } from "../../application/utils/functions/functions";



type Props = {
    listing: any;
}
const ApartmentItem : React.FC<Props> = ({listing}) =>{

    
    
    return(
        <View style={styles.card}>
            <Image source={{uri: listing.medium_url}} style={styles.images} />
            <View style={styles.rightContainer}>
                <Text style={styles.title}>{listing.name}</Text>
                <Text style={styles.desc}>{truncateText(listing.description, 30)}</Text>
                <View style={styles.footer}>
                    <Text style={styles.price}>DT {listing.price} night </Text>
                    <Text style={styles.price}> ★ {listing.review_scores_rating / 20} ({listing.number_of_reviews})</Text>
                </View>
            </View>
        </View>
    )
    
 
};

const styles = StyleSheet.create({
    card :{
        backgroundColor: '#fff',
        //position: 'relative',
        //bottom: 70,
        //padding: 10,
        //right: 10,
        //left: 10,

        flexDirection: 'row',
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