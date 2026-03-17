import React, { useState, useEffect } from "react";
import { AiOutlineStar } from "react-icons/ai";
import type { FreelancerProfile } from "../../../types/domains/profile";
import type { Review } from "../../../types/domains/freelancer";
import { freelancerService } from "../../../services";

interface FreelancerReviewsTabProps {
  freelancer: FreelancerProfile;
}

const FreelancerReviewsTab: React.FC<FreelancerReviewsTabProps> = ({
  freelancer,
}) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadReviews = async () => {
      try {
        // Fetch fresh data from API to get latest reviews
        const response = await freelancerService.getFreelancerById(
          freelancer.id
        );

        if (response.success && response.data) {
          // Convert API reviews to display format
          const reviewsData: Review[] = (response.data.reviewsReceived || []).map(
            (review: any, index: number) => ({
              id: parseInt(review.id) || index,
              userName: "Khách hàng", // API doesn't provide customer name
              userAvatar: "https://via.placeholder.com/50",
              rating: review.rating,
              comment: review.comment,
              date: new Date(review.createdAt).toLocaleDateString("vi-VN"),
              service: (response.data?.services || [])[0]?.title || "Dịch vụ",
            })
          );
          setReviews(reviewsData);
        }
      } catch (error) {
        console.error("Failed to load reviews:", error);
      } finally {
        setLoading(false);
      }
    };

    loadReviews();
  }, [freelancer.id]);

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-semibold text-gray-800">
          Đánh giá từ khách hàng ({freelancer.reviewsCount})
        </h3>
        <div className="flex items-center">
          <AiOutlineStar className="w-5 h-5 text-yellow-400 mr-1" />
          <span className="text-lg font-semibold">
            {freelancer.rating.toFixed(1)}
          </span>
          <span className="text-gray-500 ml-2">/ 5.0</span>
        </div>
      </div>

      <div className="space-y-6">
        {reviews.map((review) => (
          <div key={review.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <img
                  src={review.userAvatar}
                  alt={review.userName}
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <h4 className="font-semibold text-gray-800">
                    {review.userName}
                  </h4>
                  <div className="flex items-center mt-1">
                    {[...Array(5)].map((_, i) => (
                      <AiOutlineStar
                        key={i}
                        className={`w-4 h-4 ${
                          i < review.rating
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                    <span className="text-sm text-gray-500 ml-2">
                      {review.date}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-gray-700 mb-4">{review.comment}</p>

            <div className="text-sm text-gray-500">
              Dịch vụ:{" "}
              <span className="font-medium text-gray-700">
                {review.service}
              </span>
            </div>
          </div>
        ))}

        {reviews.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Chưa có đánh giá nào</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FreelancerReviewsTab;
