import React, { useState, useEffect } from "react";
import { Star, ThumbsUp, Flag, Send } from "lucide-react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { addReply, flagReview, markHelpful } from "@/api";

// Define TypeScript types for the props and data
interface ReplyData {
  userId: string;
  userName: string;
  comment: string;
  createdAt: string;
}

interface ReviewData {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  imageUrls?: string[];
  replies?: ReplyData[];
  isFlagged: boolean;
  helpfulUserIds: string[];
  createdAt: string;
}

interface ReviewListProps {
  reviews: ReviewData[];
  user: any; // Using 'any' for user for simplicity, but a specific User type is better
  productId: string;
  type: "Flight" | "Hotel";
}

const ReviewList: React.FC<ReviewListProps> = ({
  reviews: initialReviews,
  user,
  productId,
  type,
}) => {
  const [reviews, setReviews] = useState(initialReviews || []);
  const [sortBy, setSortBy] = useState("helpful");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  useEffect(() => {
    setReviews(initialReviews || []);
  }, [initialReviews]);

  const handleHelpfulClick = async (reviewId: string) => {
    if (!user) {
      alert("You must be logged in to mark a review as helpful.");
      return;
    }

    setReviews((currentReviews) =>
      currentReviews.map((review) => {
        if (review.id === reviewId) {
          const alreadyLiked = review.helpfulUserIds?.includes(user.id);
          const newHelpfulUserIds = alreadyLiked
            ? review.helpfulUserIds.filter((id) => id !== user.id)
            : [...(review.helpfulUserIds || []), user.id];
          return {
            ...review,
            helpfulUserIds: newHelpfulUserIds,
          };
        }
        return review;
      })
    );

    try {
      await markHelpful(productId, reviewId, type, user.id);
    } catch (error) {
      console.error("Failed to mark review as helpful:", error);
      setReviews(initialReviews);
    }
  };

  const handleReplySubmit = async (reviewId: string) => {
    if (!user) {
      alert("You must be logged in to reply.");
      return;
    }
    const reply = {
      userId: user.id,
      userName: `${user.firstName} ${user.lastName}`,
      comment: replyText,
    };
    try {
      await addReply(productId, reviewId, type, reply);
      setReplyingTo(null);
      setReplyText("");
      alert("Reply posted successfully! Refresh the page to see your reply.");
    } catch (error) {
      console.error("Failed to post reply:", error);
    }
  };

  const handleFlag = async (reviewId: string) => {
    if (confirm("Are you sure you want to flag this review as inappropriate?")) {
      try {
        await flagReview(productId, reviewId, type);
        setReviews((currentReviews) =>
          currentReviews.map((review) =>
            review.id === reviewId ? { ...review, isFlagged: true } : review
          )
        );
        alert("Review flagged for review by an administrator.");
      } catch (error) {
        console.error("Failed to flag review:", error);
      }
    }
  };

  const sortedReviews = [...reviews].sort((a, b) => {
    const countA = a.helpfulUserIds?.length || 0;
    const countB = b.helpfulUserIds?.length || 0;

    if (sortBy === "helpful") {
      return countB - countA;
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  if (!reviews || reviews.length === 0) {
    return <p className="text-gray-500">No reviews yet for this listing.</p>;
  }

  return (
    <div>
      <div className="flex justify-end mb-4">
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border rounded-md p-2 text-black bg-white focus:ring-2 focus:ring-blue-500"
        >
          <option value="helpful">Most Helpful</option>
          <option value="newest">Newest</option>
        </select>
      </div>
      <div className="space-y-8">
        {sortedReviews.map((review) => {
          const userHasLiked = user && review.helpfulUserIds?.includes(user.id);
          const helpfulCount = review.helpfulUserIds?.length || 0;

          return (
            <div
              key={review.id}
              className={`border-b pb-6 ${
                review.isFlagged ? "bg-red-50 p-4 rounded-lg" : ""
              }`}
            >
              <div className="flex items-center mb-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < review.rating ? "text-yellow-400" : "text-gray-300"
                      }`}
                      fill="currentColor"
                    />
                  ))}
                </div>
                <p className="ml-3 text-sm font-semibold text-black">
                  {review.userName}
                </p>
              </div>
              {/* FIX: This line displays the review comment */}
              <p className="text-gray-700 mb-4">{review.comment}</p>

              <div className="flex space-x-2 mt-4">
                {(review.imageUrls || []).map((url, i) => (
                  <img
                    key={i}
                    src={`http://localhost:8081${url}`}
                    alt={`Review attachment ${i + 1}`}
                    className="w-24 h-24 object-cover rounded-md cursor-pointer transition-transform hover:scale-105"
                    onClick={() => window.open(`http://localhost:8081${url}`)}
                  />
                ))}
              </div>

              <div className="flex items-center text-sm text-gray-500 mt-4">
                <button
                  onClick={() => handleHelpfulClick(review.id)}
                  className={`flex items-center hover:text-blue-600 ${
                    userHasLiked ? "text-blue-600 font-bold" : ""
                  }`}
                >
                  <ThumbsUp
                    className={`w-4 h-4 mr-1 ${
                      userHasLiked ? "fill-current" : ""
                    }`}
                  />
                  Helpful ({helpfulCount})
                </button>
                <span className="mx-2">·</span>
                <button
                  onClick={() =>
                    setReplyingTo(replyingTo === review.id ? null : review.id)
                  }
                  className="hover:text-blue-600"
                >
                  Reply
                </button>
                {user?.role === "ADMIN" && (
                  <>
                    <span className="mx-2">·</span>
                    <button
                      onClick={() => handleFlag(review.id)}
                      className="flex items-center text-red-500 hover:text-red-700"
                      disabled={review.isFlagged}
                    >
                      <Flag className="w-4 h-4 mr-1" />
                      {review.isFlagged ? "Flagged" : "Flag"}
                    </button>
                  </>
                )}
              </div>

              {replyingTo === review.id && (
                <div className="mt-4 pl-8">
                  <Textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Write a public reply..."
                    className="text-black bg-white"
                  />
                  <Button
                    onClick={() => handleReplySubmit(review.id)}
                    className="mt-2"
                    size="sm"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Post Reply
                  </Button>
                </div>
              )}

              <div className="mt-4 pl-8 space-y-4 border-l-2">
                {(review.replies || []).map((reply, i) => (
                  <div key={i} className="pl-4">
                    <p className="font-semibold text-sm text-black">
                      {reply.userName}
                    </p>
                    <p className="text-gray-600">{reply.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ReviewList;