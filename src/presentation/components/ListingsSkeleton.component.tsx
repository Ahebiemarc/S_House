// components/ListingSkeleton.tsx
import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Card } from 'react-native-paper';

const { width } = Dimensions.get('window');
const SKELETON_ITEM_HEIGHT = 380; // Hauteur approximative d'un élément de listing

const SkeletonPlaceholder: React.FC = () => (
  <View style={styles.skeletonItem}>
    <Card style={styles.card}>
      <View style={styles.imagePlaceholder} />
      <Card.Content style={styles.content}>
        <View style={styles.textPlaceholderShort} />
        <View style={styles.textPlaceholderLong} />
        <View style={styles.textPlaceholderMedium} />
      </Card.Content>
    </Card>
  </View>
);

const ListingSkeleton: React.FC<{ count?: number }> = ({ count = 3 }) => {
  return (
    <View style={styles.container}>
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonPlaceholder key={index} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginTop: 25,
  },
  skeletonItem: {
    marginBottom: 16,
  },
  card: {
    borderRadius: 10,
    elevation: 2, // Pour un léger effet d'ombre
    backgroundColor: '#e0e0e0', // Couleur de fond du skeleton
  },
  imagePlaceholder: {
    width: '100%',
    height: 200, // Hauteur de l'image placeholder
    backgroundColor: '#c7c7c7', // Couleur plus foncée pour l'image
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  content: {
    padding: 10,
  },
  textPlaceholderShort: {
    width: '40%',
    height: 20,
    backgroundColor: '#c7c7c7',
    borderRadius: 4,
    marginBottom: 8,
  },
  textPlaceholderLong: {
    width: '90%',
    height: 18,
    backgroundColor: '#c7c7c7',
    borderRadius: 4,
    marginBottom: 8,
  },
  textPlaceholderMedium: {
    width: '60%',
    height: 18,
    backgroundColor: '#c7c7c7',
    borderRadius: 4,
  },
});

export default ListingSkeleton;
