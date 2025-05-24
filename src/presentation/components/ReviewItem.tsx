// components/ReviewItem.tsx
import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { StarRating } from './StarRating'; // Assurez-vous que le chemin est correct
import { Review } from '../../domain/interface/Review.interface';

interface ReviewItemProps {
  review: Review;
}

const formatDate = (dateString: string): string => {
    if (!dateString) return '';
    if (dateString.includes('il y a')) return dateString;
  
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
  
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);
    const diffMonth = Math.floor(diffDay / 30);
    const diffYear = Math.floor(diffMonth / 12);
  
    if (diffSec < 60) return `à l’instant`;
    if (diffMin === 1) return `il y a 1 minute`;
    if (diffMin < 60) return `il y a ${diffMin} minutes`;
    if (diffHour === 1) return `il y a 1 heure`;
    if (diffHour < 24) return `il y a ${diffHour} heures`;
    if (diffDay === 1) return `il y a 1 jour`;
    if (diffDay < 30) return `il y a ${diffDay} jours`;
    if (diffMonth === 1) return `il y a 1 mois`;
    if (diffMonth < 12) return `il y a ${diffMonth} mois`;
    if (diffYear === 1) return `il y a 1 an`;
    return `il y a ${diffYear} ans`;
  };
  
  


export const ReviewItem: React.FC<ReviewItemProps> = ({ review }) => {
  return (
    <View style={styles.container}>
      <Image
        source={review.user.avatar ? { uri: review.user.avatar } : require('../../presentation/assets/images/defautProfile.png')} // Ajoutez une image placeholder
        style={styles.avatar}
      />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.authorName}>{review.user.username}</Text>
          <Text style={styles.date}>{formatDate(review.createdAt)}</Text>
        </View>
        <StarRating rating={review.rating} size={16} color="#FFC107" />
        <Text style={styles.comment} numberOfLines={3} ellipsizeMode="tail">
            {review.comment}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 15,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  authorName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  date: {
    fontSize: 12,
    color: '#777',
  },
  comment: {
    fontSize: 14,
    color: '#555',
    marginTop: 5,
    lineHeight: 20,
  },
});