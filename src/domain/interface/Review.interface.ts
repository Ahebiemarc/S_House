
//interfaces/Review.interface.ts
export interface ReviewData {
    rating: number;
    comment: string;
}

// src/domain/interface/Review.interface.ts
export interface ReviewAuthor {
  id: string;
  username: string;
  avatar?: string; // URL de l'avatar, optionnelle
}

export interface Review {
  id: string;
  rating: number;
  comment: string;
  user: ReviewAuthor; // Informations sur l'auteur de l'avis
  createdAt: string; // Date de création (peut être un objet Date si vous préférez)
  postId: string; // L'ID du post auquel cet avis est associé
}

// Interface pour les données envoyées lors de la création/mise à jour
export interface ReviewData {
  rating: number;
  comment: string;
}

// Pour les statistiques d'évaluation
export interface RatingStats {
  average: number;
  total: number;
  distribution: {
    excellent: number; // 5 étoiles
    good: number;      // 4 étoiles
    average: number;   // 3 étoiles
    belowAverage: number; // 2 étoiles
    poor: number;      // 1 étoile
  };
}
  