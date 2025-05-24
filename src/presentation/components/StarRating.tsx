//components/StarRating.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface StarRatingProps {
  rating: number;
  onRate?: (rating: number) => void; // Pour la sélection
  size?: number;
  color?: string;
  style?: object;
}

export const StarRating: React.FC<StarRatingProps> = ({ rating, onRate, size = 20, color = '#FFD700', style }) => {
  const stars = [1, 2, 3, 4, 5];

  return (
    <View style={[styles.container, style]}>
      {stars.map((star) => (
        <TouchableOpacity key={star} onPress={() => onRate?.(star)} disabled={!onRate}>
          <Ionicons
            name={star <= rating ? 'star' : 'star-outline'}
            size={size}
            color={color}
            style={styles.star}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  star: {
    marginHorizontal: 2,
  },
});