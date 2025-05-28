import React, { createContext, useState, useContext, ReactNode, useCallback, useEffect } from 'react';
import { RatingStats, Review, ReviewData } from '../../domain/interface/Review.interface';
import ReviewService from '../../infrastructure/api/reviews.api';

interface ReviewContextType {
  reviews: Review[];
  ratingStats: RatingStats | null;
  isLoading: boolean;
  error: string | null;
  fetchReviews: (postId: string) => Promise<void>;
  addReview: (postId: string, reviewData: ReviewData) => Promise<boolean>; // Retourne true si succès
}

const ReviewContext = createContext<ReviewContextType | undefined>(undefined);

export const useReviews = () => {
  const context = useContext(ReviewContext);
  if (!context) {
    throw new Error('useReviews must be used within a ReviewProvider');
  }
  return context;
};

interface ReviewProviderProps {
  children: ReactNode;
  postId: string; // L'ID du post pour lequel on gère les avis
}

export const ReviewProvider: React.FC<ReviewProviderProps> = ({ children, postId }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [ratingStats, setRatingStats] = useState<RatingStats | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const calculateRatingStats = (currentReviews: Review[]): RatingStats | null => {
    if (!currentReviews || currentReviews.length === 0) {
      return {
        average: 0,
        total: 0,
        distribution: { excellent: 0, good: 0, average: 0, belowAverage: 0, poor: 0 },
      };
    }

    const totalRating = currentReviews.reduce((sum, review) => sum + review.rating, 0);
    const average = totalRating / currentReviews.length;
    const distribution = { excellent: 0, good: 0, average: 0, belowAverage: 0, poor: 0 };

    currentReviews.forEach(review => {
      if (review.rating === 5) distribution.excellent++;
      else if (review.rating === 4) distribution.good++;
      else if (review.rating === 3) distribution.average++;
      else if (review.rating === 2) distribution.belowAverage++;
      else if (review.rating === 1) distribution.poor++;
    });

    return {
      average: parseFloat(average.toFixed(1)),
      total: currentReviews.length,
      distribution,
    };
  };

  const fetchReviews = useCallback(async (currentPostId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      // Simuler des données si API.get n'est pas encore prêt
      // const fetchedReviews: Review[] = mockReviews.filter(r => r.postId === currentPostId);
      const fetchedReviews: Review[] = await ReviewService.getAllByPost(currentPostId);
      setReviews(fetchedReviews);
      setRatingStats(calculateRatingStats(fetchedReviews));
    } catch (e) {
      setError('Failed to fetch reviews.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addReview = async (currentPostId: string, reviewData: ReviewData): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      const newReview = await ReviewService.add(currentPostId, reviewData);
      // Pour l'instant, l'API add retourne `any`. Idéalement, elle retournerait le `Review` complet.
      // On re-fetch les avis pour mettre à jour la liste et les stats.
      // Si l'API retournait le `Review` complet avec `author`, on pourrait l'ajouter directement.
      await fetchReviews(currentPostId);
      return true;
    } catch (e) {
      setError('Failed to add review.');
      console.error(e);
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Fetch reviews when postId changes or on initial mount
  useEffect(() => {
    if (postId) {
      fetchReviews(postId);
    }
  }, [postId, fetchReviews]);


  return (
    <ReviewContext.Provider value={{ reviews, ratingStats, isLoading, error, fetchReviews, addReview }}>
      {children}
    </ReviewContext.Provider>
  );
};

// Mock data pour le développement si votre API n'est pas prête
// Commentez ou supprimez ceci si votre API fonctionne
/*
const mockUser1: ReviewAuthor = { id: 'user1', name: 'Joan Perkins', avatarUrl: 'https://randomuser.me/api/portraits/women/68.jpg' };
const mockUser2: ReviewAuthor = { id: 'user2', name: 'Frank Garrett', avatarUrl: 'https://randomuser.me/api/portraits/men/75.jpg' };
const mockUser3: ReviewAuthor = { id: 'user3', name: 'Randy Palmer', avatarUrl: 'https://randomuser.me/api/portraits/men/32.jpg' };

const mockReviews: Review[] = [
  { id: 'rev1', postId: 'post1', author: mockUser1, rating: 5, comment: 'This chair is a great addition for any room in your home, not only just the living room. Featuring a mid-century design with modern available on the market. However, and with that said, if you are like most people in the...', createdAt: '1 days ago' },
  { id: 'rev2', postId: 'post1', author: mockUser2, rating: 4, comment: 'Suspendisse potenti. Nullam tincidunt lacus tellus, aliquam est vehicula a. Pellentesque consectetur condimentum nula, eleifend condimentum purus.', createdAt: '4 days ago' },
  { id: 'rev3', postId: 'post1', author: mockUser3, rating: 4, comment: 'Aenean ante nisi, gravida non mattis semper, varius et magna.', createdAt: '1 month ago' },
  { id: 'rev4', postId: 'post2', author: mockUser1, rating: 3, comment: 'Correct mais sans plus pour ce post.', createdAt: '2 days ago' },
];
*/