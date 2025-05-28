//components/ExploreHeader.component.tsx

import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { RootStackParamList } from "../../domain/types/route.types";
import React, { useRef, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import HapticFeedback from "react-native-haptic-feedback";

import Colors from "../../application/utils/constants/Color"
import { StackNavigationProp } from "@react-navigation/stack";
import { Property } from "../../domain/enum/post";




const categories = [
  { name: 'All', icon: 'pallet' },

  { name: 'APARTMENT', icon: 'home' },
  { name: 'STUDIO', icon: 'other-houses' },
  { name: 'S_1', icon: 'house-siding' },
  { name: 'S_2', icon: 'house-siding' },
  { name: 'S_3', icon: 'house-siding' },
  { name: 'VILLA', icon: 'warehouse' },
  { name: 'FURNITURE', icon: 'bed' },
  { name: 'NO_FURNITURE', icon: 'bed' },
  { name: 'DUPLEX', icon: 'house' },
  { name: 'HOUSE', icon: 'houseboat' },
] as { name: keyof typeof Property; icon: string }[];
  
interface Props {
    onCategoryChanged: (category: any) => void;
}

type ExploreHeaderNavigationProp = StackNavigationProp<RootStackParamList, 'Tab'>;


const ExploreHeader:React.FC<Props> = ({onCategoryChanged}) => {

  const scrollRef = useRef<ScrollView>(null);
  const itemsRef = useRef<Array<TouchableOpacity | null>>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const navigation = useNavigation<ExploreHeaderNavigationProp>();

  {/*const selectCategory = (index: number) => {
    const selected = itemsRef.current[index];
    setActiveIndex(index);
    selected?.measure((fx, fy, width, height, px) => {
      scrollRef.current?.scrollTo({ x: px - 16, y: 0, animated: true });
    });
    HapticFeedback.trigger('impactLight', { enableVibrateFallback: true});
    onCategoryChanged(categories[index].name);
  };*/}

  const selectCategory = (index: number) => {
    const selected = itemsRef.current[index];
    setActiveIndex(index);
    selected?.measure((fx, fy, width, height, px) => {
      scrollRef.current?.scrollTo({ x: px - 16, y: 0, animated: true });
    });
    HapticFeedback.trigger('impactLight', { enableVibrateFallback: true });
    const selectedKey = categories[index].name;
    onCategoryChanged(selectedKey); // Envoie uniquement la clé à Explore
  };

  return(
    <SafeAreaView style={{ backgroundColor: '#fff' }}>
    <View style={styles.container}>
      <View style={styles.actionRow}>
        <TouchableOpacity onPress={() => navigation.navigate('Booking')}>
          <View style={styles.searchBtn}>
            <Ionicons name="search" size={24} />
            <View>
              <Text style={{ fontFamily: 'Poppins-SemiBold', color: Colors.grey, }}>Where to?</Text>
              <Text style={{ color: Colors.grey, fontFamily: 'mon' }}>Anywhere · Any week</Text>
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterBtn}>
          <Ionicons name="options-outline" color={Colors.grey} size={24} />
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        ref={scrollRef}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          alignItems: 'center',
          gap: 20,
          paddingHorizontal: 16,
        }}>
        {categories.map((item, index) => (
          <TouchableOpacity
            ref={(el) => (itemsRef.current[index] = el)}
            key={index}
            style={activeIndex === index ? styles.categoriesBtnActive : styles.categoriesBtn}
            onPress={() => selectCategory(index)}
            >
            <MaterialIcons
              name={item.icon as any}
              size={30}
              color={activeIndex === index ? '#000' : Colors.grey}
            />
            <Text style={activeIndex === index ? styles.categoryTextActive : styles.categoryText}>
            {(item.name in Property) ? Property[item.name as keyof typeof Property] : item.name}

            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  </SafeAreaView>
    )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    marginTop:10,
    height: 130,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: {
      width: 1,
      height: 10,
    },
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingBottom: 16,
  },

  searchBtn: {

    backgroundColor: '#fff',
    flexDirection: 'row',
    gap: 10,
    paddingVertical: 5,
    paddingHorizontal: 14,
    alignItems: 'center',
    width: 280,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#c2c2c2',
    borderRadius: 30,

    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: {
      width: 1,
      height: 1,
    },
  },
  filterBtn: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#A2A0A2',
    borderRadius: 24,
  },
  categoryText: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.grey,
  },
  categoryTextActive: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: '#000',
  },
  categoriesBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 8,
  },
  categoriesBtnActive: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomColor: '#000',
    borderBottomWidth: 2,
    //paddingBottom: 8,
  },
})
export default ExploreHeader;