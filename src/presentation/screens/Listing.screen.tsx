import React, { useLayoutEffect } from "react";
import { Dimensions, Image, SafeAreaView, Share, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { RootStackScreenProps } from "../../domain/types/route.types";
import Animated, { interpolate, SlideInDown, useAnimatedRef, useAnimatedStyle, useScrollViewOffset } from "react-native-reanimated";
import Ionicons from 'react-native-vector-icons/Ionicons';

import Colors from "../../application/utils/constants/Color";
import { defaultStyles } from "../../application/utils/constants/Styles";
import ImagesCarousel from "../components/ImageCarousel";
import { images } from "../../application/utils/constants/assets";

const IMG_HEIGHT = 300;
const {width} = Dimensions.get('window');

type Props = RootStackScreenProps<'Listing'>

const Listing:React.FC<Props> = ({route, navigation}) => {

    const { item } = route.params;
    console.log(item);
    console.log("00000000000000000000");
    

    const scrollRef = useAnimatedRef<Animated.ScrollView>();

    const scrollOffset = useScrollViewOffset(scrollRef);

    const shareListing = async () => {
        try {
          await Share.share({
            title: item.name,
            url: item.listing_url,
          });
        } catch (err) {
          console.log(err);
        }
      };

    useLayoutEffect(() => {
        navigation.setOptions({
          headerTitle: '',
          headerTransparent: true,
    
          headerBackground: () => (
            <Animated.View style={[headerAnimatedStyle, styles.header]}></Animated.View>
          ),
          headerRight: () => (
            <View style={styles.bar}>
              <TouchableOpacity style={styles.roundButton} onPress={shareListing}>
                <Ionicons name="share-outline" size={22} color={'#000'} />
              </TouchableOpacity>
              <TouchableOpacity style={[styles.roundButton, {marginRight: 10}]}>
                <Ionicons name="heart-outline" size={22} color={'#000'} />
              </TouchableOpacity>
            </View>
          ),
          headerLeft: () => (
            <TouchableOpacity style={[styles.roundButton, {marginLeft: 10}]} onPress={() => navigation.goBack()}>
              <Ionicons name="chevron-back" size={24} color={'#000'} />
            </TouchableOpacity>
          ),
        });
      }, []);

    const imageAnimatedStyle = useAnimatedStyle(() => {
        return {
            transform: [
                { translateY: interpolate(scrollOffset.value, [-IMG_HEIGHT, 0, IMG_HEIGHT], [-IMG_HEIGHT / 2, 0, IMG_HEIGHT * 0.75]) },
                { scale: interpolate(scrollOffset.value, [-IMG_HEIGHT, 0, IMG_HEIGHT], [2, 1, 1]) },
            ],
        };
    });

    const headerAnimatedStyle = useAnimatedStyle(() => {
        return {
          opacity: interpolate(scrollOffset.value, [0, IMG_HEIGHT / 1.5], [0, 1]),
        };
      }, []);
    
    
    return(
        <SafeAreaView style={styles.container}>
            <Animated.ScrollView
                contentContainerStyle={{ paddingBottom: 100 }}
                ref={scrollRef}
                scrollEventThrottle={16}
                showsVerticalScrollIndicator={false}
            >

                {/*<Animated.Image
                source={{ uri: item.xl_picture_url }}
                style={[styles.image, imageAnimatedStyle]}
                resizeMode="cover"
               />*/}
               <ImagesCarousel images={images} stylesP={[styles.image, imageAnimatedStyle]}/>
                <View style={styles.infoContainer}>
                    <Text style={styles.name}>{item.name}</Text>
                    <Text style={styles.location}>
                        {item.room_type} in {item.smart_location}
                    </Text>
                    <Text style={styles.rooms}>
                        {item.guests_included} guests · {item.bedrooms} bedrooms · {item.beds} bed ·{' '}
                        {item.bathrooms} bathrooms
                    </Text>
                    <View style={{ flexDirection: 'row', gap: 4 }}>
                        <Ionicons name="star" size={16} />
                        <Text style={styles.ratings}>
                        {item.review_scores_rating / 20} · <Text style={{textDecorationLine: 'underline'}}>{item.number_of_reviews} reviews</Text>
                        </Text>
                    </View>
                    <View style={styles.divider} />

                    <View style={styles.hostView}>
                        <Image source={{ uri: item.host_picture_url }} style={styles.host} />

                        <View>
                        <Text style={{ fontWeight: '500', fontSize: 16 }}>Hosted by {item.host_name}</Text>
                        <Text>Host since {item.host_since}</Text>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    <Text style={styles.description}>{item.description}</Text>
                </View>
            </Animated.ScrollView>
            <Animated.View style={defaultStyles.footer} entering={SlideInDown.delay(200)}>
                <View
                style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <TouchableOpacity style={styles.footerText}>
                        <Text style={styles.footerPrice}>€{item.price}</Text>
                        <Text style={{fontFamily: 'Poppins-Medium'}}>Month</Text>

                    </TouchableOpacity>


                    <TouchableOpacity style={[defaultStyles.btn, { paddingRight: 20, paddingLeft: 20 }]}>
                        <Text style={defaultStyles.btnText}>Reserve</Text>
                    </TouchableOpacity>

                </View>
            </Animated.View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff"
    },
    image: {
        height: IMG_HEIGHT,
        width,
    },
    infoContainer: {
        padding: 24,
        backgroundColor: '#fff',
      },
      name: {
        fontSize: 26,
        //fontWeight: 'bold',
        fontFamily: 'Poppins-SemiBold',
      },
      location: {
        fontSize: 18,
        marginTop: 10,
        fontFamily: 'Poppins-SemiBold',
      },
      rooms: {
        fontSize: 16,
        color: Colors.grey,
        marginVertical: 4,
        fontFamily: 'Poppins-Medium',
      },
      ratings: {
        fontSize: 16,
        fontFamily: 'Poppins-SemiBold',
      },
      divider: {
        height: StyleSheet.hairlineWidth,
        backgroundColor: Colors.grey,
        marginVertical: 16,
      },
      host: {
        width: 50,
        height: 50,
        borderRadius: 50,
        backgroundColor: Colors.grey,
      },
      hostView: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
      },
      footerText: {
        height: '100%',
        justifyContent: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
      },
      footerPrice: {
        fontSize: 18,
        fontFamily: 'Poppins-SemiBold',
      },
      roundButton: {
        width: 40,
        height: 40,
        borderRadius: 50,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        color: Colors.primary,
      },
      bar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
      },
      header: {
        backgroundColor: '#fff',
        height: 70,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: Colors.grey,
      },
    
      description: {
        fontSize: 16,
        marginTop: 10,
        fontFamily: 'Poppins-Medium',
      },
})

export default Listing;