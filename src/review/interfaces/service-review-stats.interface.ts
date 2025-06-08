export interface ServiceReviewStats {
  totalReviews: number;
  averageRating: number;
  reviews: {
    id: number;
    rating: number;
    comment: string;
    user: {
      id: number;
      firstName: string;
      lastName: string;
    };
    createdAt: Date;
  }[];
}
