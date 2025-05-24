import { Image, TouchableOpacity, ViewStyle } from "react-native";
import { StyleSheet, Text, View } from "react-native";
import { truncateText } from "../../application/utils/functions/functions";
import { PostData } from "../../domain/interface/Post.interface";



type Props = {
    listing: PostData;
    containerStyle?: ViewStyle
    Onpress?: () => void;
}

const defaultImage = "https://placeholder.com/180";


const ApartmentItem : React.FC<Props> = ({listing, containerStyle={}, Onpress}) =>{

    //const isNested = listing?.properties !== null;
    //const data = isNested ? listing.properties : listing

    const data = listing;

    const averageRating = data.reviews.length > 0
        ? data.reviews.reduce((sum:number, review:any) => sum + review.rating, 0) / data.reviews.length
        : 0;
    
    console.log(data.images[0]);
    
    
    return(
        <View style={[styles.card, containerStyle]}>
            <TouchableOpacity style={{flexDirection: 'row', justifyContent: 'center', alignContent: 'center'}} activeOpacity={0.9} onPress={Onpress}>
            <Image source={{uri: data.images[0] as any || defaultImage}} style={styles.images} />
            <View style={styles.rightContainer}>
                <Text style={styles.title}>{truncateText(data.title, 30)}</Text>
                <Text style={styles.desc}>{truncateText(data.desc, 30)}</Text>
                <View style={styles.footer}>
                    <Text style={styles.price}>DT {data.price} / mois </Text>
                    <Text style={styles.price}> ★ {averageRating !== 0  ? averageRating : 'N/A'} ({data.reviews.length})</Text>
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