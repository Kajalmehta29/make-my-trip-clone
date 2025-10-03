import React, { useState } from "react";
import {
  User as UserIcon,
  Phone,
  Mail,
  Edit2,
  MapPin,
  Calendar,
  CreditCard,
  X,
  Check,
  LogOut,
  Plane,
  Building2,
  AlertTriangle,
  Star,
  Upload,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { clearUser, setUser } from "@/store";
import {
  editprofile,
  cancelBooking,
  addFlightReview,
  addHotelReview,
  uploadFile, // Make sure to import uploadFile
} from "@/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

// Define TypeScript types for our data
interface Booking {
  bookingId: string;
  productId: string;
  type: "Flight" | "Hotel";
  date: string;
  quantity: number;
  totalPrice: number;
  cancelled?: boolean;
  cancellationReason?: string;
  refundAmount?: number;
  refundStatus?: string;
}

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  bookings: Booking[];
}

interface ReviewFormProps {
  booking: Booking;
  user: User;
  onReviewSubmit: () => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({
  booking,
  user,
  onReviewSubmit,
}) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [files, setFiles] = useState<FileList | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiles(e.target.files);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      alert("Please select a star rating.");
      return;
    }
    setIsUploading(true);

    const imageUrls: string[] = [];
    if (files) {
      for (let i = 0; i < files.length; i++) {
        try {
          const response = await uploadFile(files[i]);
          imageUrls.push(response.url);
        } catch (error) {
          console.error("File upload failed:", error);
          alert("One or more images failed to upload. Please try again.");
          setIsUploading(false);
          return;
        }
      }
    }

    const review = {
      userId: user.id,
      userName: `${user.firstName} ${user.lastName}`,
      rating,
      comment,
      imageUrls,
    };

    try {
      if (booking.type === "Flight") {
        await addFlightReview(booking.productId, review);
      } else {
        await addHotelReview(booking.productId, review);
      }
      onReviewSubmit();
    } catch (error) {
      console.error("Failed to submit review:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <h3 className="text-lg font-medium text-black">Rate your experience</h3>
        <div className="flex space-x-1 mt-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`w-6 h-6 cursor-pointer ${
                rating >= star
                  ? "text-yellow-400 fill-current"
                  : "text-gray-300"
              }`}
              onClick={() => setRating(star)}
            />
          ))}
        </div>
      </div>
      <div>
        <label
          htmlFor="comment"
          className="block text-sm font-medium text-gray-700"
        >
          Write a review
        </label>
        <Textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="mt-1 block w-full text-black"
          rows={4}
          placeholder="Tell us about your experience..."
        />
      </div>
      <div>
        <label
          htmlFor="photos"
          className="block text-sm font-medium text-gray-700"
        >
          Add photos (optional)
        </label>
        <div className="mt-1 flex items-center">
          <label
            htmlFor="file-upload"
            className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
          >
            <Upload className="w-4 h-4" />
            Choose Files
            <input
              id="file-upload"
              name="file-upload"
              type="file"
              multiple
              className="sr-only"
              onChange={handleFileChange}
              accept="image/*"
            />
          </label>
          {files && (
            <span className="ml-3 text-sm text-gray-500">
              {files.length} file(s) selected
            </span>
          )}
        </div>
      </div>
      <Button type="submit" className="w-full" disabled={isUploading}>
        {isUploading ? "Submitting..." : "Submit Review"}
      </Button>
    </form>
  );
};

const ProfilePage = () => {
  const dispatch = useDispatch();
  const user: User | null = useSelector((state: any) => state.user.user);
  const router = useRouter();
  const [isReviewOpen, setReviewOpen] = useState(false);
  const [selectedBookingForReview, setSelectedBookingForReview] =
    useState<Booking | null>(null);

  const [cancellationReason, setCancellationReason] = useState("");
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(
    null
  );
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phoneNumber: user?.phoneNumber || "",
  });

  const handleWriteReview = (booking: Booking) => {
    setSelectedBookingForReview(booking);
    setReviewOpen(true);
  };

  const logout = () => {
    dispatch(clearUser());
    router.push("/");
  };

  const handleCancelBooking = (bookingId: string) => {
    setSelectedBookingId(bookingId);
  };

  const confirmCancelBooking = async () => {
    if (!selectedBookingId || !user) return;

    try {
      const updatedBooking = await cancelBooking(
        user.id,
        selectedBookingId,
        cancellationReason
      );

      const updatedBookings = user.bookings
        .map((booking: Booking) => {
          if (booking && booking.bookingId === selectedBookingId) {
            return updatedBooking;
          }
          return booking;
        })
        .filter(Boolean);

      dispatch(setUser({ ...user, bookings: updatedBookings }));
    } catch (error) {
      console.error("Error cancelling booking:", error);
    } finally {
      setSelectedBookingId(null);
      setCancellationReason("");
    }
  };

  const handleSave = async () => {
    if (!user) return;
    try {
      const data = await editprofile(
        user.id,
        userData.firstName,
        userData.lastName,
        userData.email,
        userData.phoneNumber
      );
      dispatch(setUser(data));
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      setUserData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
      });
      setIsEditing(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "Invalid Date";
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const handleEditFormChange = (field: string, value: string) => {
    setUserData((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Profile Section */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl text-black font-bold">Profile</h2>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-red-600 flex items-center space-x-1 hover:text-red-700"
                  >
                    <Edit2 className="w-4 h-4" />
                    <span>Edit</span>
                  </button>
                )}
              </div>

              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={userData.firstName}
                      onChange={(e) =>
                        handleEditFormChange("firstName", e.target.value)
                      }
                      className="w-full px-3 py-2 border text-black rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={userData.lastName}
                      onChange={(e) =>
                        handleEditFormChange("lastName", e.target.value)
                      }
                      className="w-full px-3 py-2 text-black border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={userData.email}
                      readOnly
                      className="w-full px-3 py-2 text-black border rounded-lg bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={userData.phoneNumber}
                      onChange={(e) =>
                        handleEditFormChange("phoneNumber", e.target.value)
                      }
                      className="w-full px-3 py-2 border text-black rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={handleSave}
                      className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
                    >
                      <Check className="w-4 h-4" />
                      <span>Save</span>
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2"
                    >
                      <X className="w-4 h-4" />
                      <span>Cancel</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center space-x-3">
                    <UserIcon className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="font-medium text-black">
                        {user?.firstName} {user?.lastName}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center text-black space-x-3">
                    <Mail className="w-5 h-5 text-gray-500" />
                    <p>{user?.email}</p>
                  </div>
                  <div className="flex text-black items-center space-x-3">
                    <Phone className="w-5 h-5 text-gray-500" />
                    <p>{user?.phoneNumber}</p>
                  </div>
                  <button
                    className="w-full mt-4 flex items-center justify-center space-x-2 text-red-600 hover:text-red-700"
                    onClick={logout}
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Bookings Section */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl text-black font-bold mb-6">
                My Bookings
              </h2>
              <div className="space-y-6">
                {user?.bookings
                  ?.filter(Boolean)
                  .map((booking: Booking, index: any) => (
                    <div
                      key={index}
                      className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex text-black items-center space-x-3">
                          {booking?.type === "Flight" ? (
                            <div className="bg-blue-100 p-2 rounded-lg">
                              <Plane className="w-6 h-6 text-blue-600" />
                            </div>
                          ) : (
                            <div className="bg-green-100 p-2 rounded-lg">
                              <Building2 className="w-6 h-6 text-green-600" />
                            </div>
                          )}
                          <div>
                            <h3 className="font-semibold">{booking?.type}</h3>
                            <p className="text-sm text-gray-500">
                              Booking ID: {booking?.bookingId}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-black">
                            ₹ {booking?.totalPrice.toLocaleString("en-IN")}
                          </p>
                          <p className="text-sm text-gray-500">
                            {booking?.type}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(booking?.date)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-4 h-4" />
                          <span>{booking?.type}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <CreditCard className="w-4 h-4" />
                          <span>Paid</span>
                        </div>
                      </div>
                      <div className="mt-4 flex flex-col items-start gap-4">
                        {booking?.cancelled ? (
                          <div>
                            <div className="flex items-center space-x-1 text-red-500">
                              <AlertTriangle className="w-4 h-4" />
                              <span>Cancelled</span>
                            </div>
                            <p className="text-sm text-gray-500">
                              Reason: {booking.cancellationReason}
                            </p>
                            <p className="text-sm text-gray-500">
                              Refund Status: {booking.refundStatus} (₹
                              {booking.refundAmount})
                            </p>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-4">
                            <button
                              onClick={() =>
                                handleCancelBooking(booking?.bookingId)
                              }
                              className="text-red-600 hover:text-red-700"
                            >
                              Cancel Booking
                            </button>
                            <button
                              onClick={() => handleWriteReview(booking)}
                              className="text-blue-600 hover:text-blue-700"
                            >
                              Write a Review
                            </button>
                          </div>
                        )}
                        {selectedBookingId === booking?.bookingId && (
                          <div className="mt-4 w-full">
                            <label
                              htmlFor="cancellationReason"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Reason for Cancellation:
                            </label>
                            <select
                              id="cancellationReason"
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-black"
                              value={cancellationReason}
                              onChange={(e) =>
                                setCancellationReason(e.target.value)
                              }
                            >
                              <option value="">Select a reason</option>
                              <option value="Change of plans">
                                Change of plans
                              </option>
                              <option value="Found a better deal">
                                Found a better deal
                              </option>
                              <option value="Booking error">
                                Booking error
                              </option>
                              <option value="Other">Other</option>
                            </select>
                            <div className="mt-2 flex justify-end">
                              <button
                                onClick={confirmCancelBooking}
                                className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
                              >
                                Confirm Cancellation
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Dialog open={isReviewOpen} onOpenChange={setReviewOpen}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>Write a Review</DialogTitle>
          </DialogHeader>
          {selectedBookingForReview && user && (
            <ReviewForm
              booking={selectedBookingForReview}
              user={user}
              onReviewSubmit={() => {
                setReviewOpen(false);
                alert("Review submitted successfully!");
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfilePage;