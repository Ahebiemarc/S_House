import { SafeAreaView, Text, View, StyleSheet, Image } from "react-native"
import Carousel from 'pinar';
import { images } from "../../../application/utils/constants/assets";






const Inbox = () => {
    return(
        <SafeAreaView>
            {/*<Text>
                Inbox
            </Text>*/}
            <View style={styles.carouselContainer} >
                <Carousel
                    style={styles.carousel}
                    showsControls={false}
                    dotStyle={styles.dotStyle}
                    activeDotStyle={[styles.dotStyle, { backgroundColor: 'white' }]}
                >
                    {images.map((img) => (
                    <Image style={styles.image} source={img.img} key={img.img} />
                ))}
                </Carousel>
            </View>
            
        </SafeAreaView>
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

export default Inbox;