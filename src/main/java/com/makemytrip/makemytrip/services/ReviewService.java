package com.makemytrip.makemytrip.services;

import com.makemytrip.makemytrip.models.Flight;
import com.makemytrip.makemytrip.models.Hotel;
import com.makemytrip.makemytrip.models.Review;
import com.makemytrip.makemytrip.models.Reply;
import com.makemytrip.makemytrip.repositories.FlightRepository;
import com.makemytrip.makemytrip.repositories.HotelRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
public class ReviewService {

    @Autowired
    private FlightRepository flightRepository;

    @Autowired
    private HotelRepository hotelRepository;

    public Review addFlightReview(String flightId, Review review) {
        Flight flight = flightRepository.findById(flightId)
                .orElseThrow(() -> new RuntimeException("Flight not found"));

        // FIX: Ensure the reviews list is initialized
        if (flight.getReviews() == null) {
            flight.setReviews(new ArrayList<>());
        }

        flight.getReviews().add(review);
        flightRepository.save(flight);
        return review;
    }

    public Review addHotelReview(String hotelId, Review review) {
        Hotel hotel = hotelRepository.findById(hotelId)
                .orElseThrow(() -> new RuntimeException("Hotel not found"));

        // FIX: Ensure the reviews list is initialized
        if (hotel.getReviews() == null) {
            hotel.setReviews(new ArrayList<>());
        }

        hotel.getReviews().add(review);
        hotelRepository.save(hotel);
        return review;
    }

    public void addReplyToReview(String productId, String reviewId, String type, Reply reply) {
        if ("Flight".equalsIgnoreCase(type)) {
            Flight flight = flightRepository.findById(productId).orElseThrow(() -> new RuntimeException("Flight not found"));
            flight.getReviews().stream()
                    .filter(r -> r.getId().equals(reviewId))
                    .findFirst()
                    .ifPresent(review -> {
                        if (review.getReplies() == null) {
                            review.setReplies(new ArrayList<>());
                        }
                        review.getReplies().add(reply);
                    });
            flightRepository.save(flight);
        } else {
            Hotel hotel = hotelRepository.findById(productId).orElseThrow(() -> new RuntimeException("Hotel not found"));
            hotel.getReviews().stream()
                    .filter(r -> r.getId().equals(reviewId))
                    .findFirst()
                    .ifPresent(review -> {
                        if (review.getReplies() == null) {
                            review.setReplies(new ArrayList<>());
                        }
                        review.getReplies().add(reply);
                    });
            hotelRepository.save(hotel);
        }
    }

    public void flagReview(String productId, String reviewId, String type) {
        if ("Flight".equalsIgnoreCase(type)) {
            Flight flight = flightRepository.findById(productId).orElseThrow(() -> new RuntimeException("Flight not found"));
            flight.getReviews().stream()
                    .filter(r -> r.getId().equals(reviewId))
                    .findFirst()
                    .ifPresent(review -> review.setFlagged(true));
            flightRepository.save(flight);
        } else {
            Hotel hotel = hotelRepository.findById(productId).orElseThrow(() -> new RuntimeException("Hotel not found"));
            hotel.getReviews().stream()
                    .filter(r -> r.getId().equals(reviewId))
                    .findFirst()
                    .ifPresent(review -> review.setFlagged(true));
            hotelRepository.save(hotel);
        }
    }

    public void markReviewAsHelpful(String productId, String reviewId, String type, String userId) {
        if ("Flight".equalsIgnoreCase(type)) {
            Flight flight = flightRepository.findById(productId).orElseThrow(() -> new RuntimeException("Flight not found"));
            flight.getReviews().stream()
                    .filter(r -> r.getId().equals(reviewId))
                    .findFirst()
                    .ifPresent(review -> {
                        if (review.getHelpfulUserIds() == null) {
                            review.setHelpfulUserIds(new ArrayList<>());
                        }
                        if (review.getHelpfulUserIds().contains(userId)) {
                            review.getHelpfulUserIds().remove(userId); // Unlike
                        } else {
                            review.getHelpfulUserIds().add(userId); // Like
                        }
                        flightRepository.save(flight);
                    });
        } else {
            Hotel hotel = hotelRepository.findById(productId).orElseThrow(() -> new RuntimeException("Hotel not found"));
            hotel.getReviews().stream()
                    .filter(r -> r.getId().equals(reviewId))
                    .findFirst()
                    .ifPresent(review -> {
                        if (review.getHelpfulUserIds() == null) {
                            review.setHelpfulUserIds(new ArrayList<>());
                        }
                        if (review.getHelpfulUserIds().contains(userId)) {
                            review.getHelpfulUserIds().remove(userId); // Unlike
                        } else {
                            review.getHelpfulUserIds().add(userId); // Like
                        }
                        hotelRepository.save(hotel);
                    });
        }
    }
}