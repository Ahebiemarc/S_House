import { SafeAreaView, Text, View, StyleSheet, Image, ImageSourcePropType, ImageStyle } from "react-native"
import Carousel from 'pinar';
import { images } from "../../application/utils/constants/assets";
import Animated from "react-native-reanimated";
import { ViewStyle } from "react-native";


type ImagesCarouselProps={
    images:any[]
    stylesP: ImageStyle[]
}

const ImagesCarousel: React.FC<ImagesCarouselProps> = ({images, stylesP}) => {
    
    return(

            <Animated.View style={styles.carouselContainer} >
                <Carousel
                    style={styles.carousel}
                    showsControls={false}
                    dotStyle={styles.dotStyle}
                    activeDotStyle={[styles.dotStyle, { backgroundColor: 'white' }]}
                >
                    {images.map((img) => (
                    <Animated.Image style={[stylesP]} source={{uri: img}} key={img} resizeMode="cover"  />
                ))}
                </Carousel>
            </Animated.View>
            
    )
}

const styles = StyleSheet.create({
    carouselContainer:{
        width: '100%',
        height: 300,
        borderRadius: 10,
    },
    carousel: {
        height: '100%',
        width: '100%',
        position: 'absolute'
    },
    dotStyle:{
        width: 8,
        height: 8,
        backgroundColor: 'silver',
        marginHorizontal: 3,
        borderRadius: 10,

    },
    image: {
        height: '100%',
        width: '100%',
        borderRadius: 20,
    },
})

export default ImagesCarousel;