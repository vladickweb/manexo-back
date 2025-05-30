export interface ServiceReviewStats {
  totalReviews: number;
  averageRating: number;
  reviews: {
    id: string;
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
