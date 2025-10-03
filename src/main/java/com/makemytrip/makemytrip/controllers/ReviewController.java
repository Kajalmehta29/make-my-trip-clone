package com.makemytrip.makemytrip.controllers;

import com.makemytrip.makemytrip.models.Reply;
import com.makemytrip.makemytrip.models.Review;
import com.makemytrip.makemytrip.services.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;


@RestController
@RequestMapping("/review")
@CrossOrigin(origins = "*")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    @PostMapping("/flight/{flightId}")
    public ResponseEntity<Review> addFlightReview(@PathVariable String flightId, @RequestBody Review review) {
        Review newReview = reviewService.addFlightReview(flightId, review);
        return ResponseEntity.ok(newReview);
    }

    @PostMapping("/hotel/{hotelId}")
    public ResponseEntity<Review> addHotelReview(@PathVariable String hotelId, @RequestBody Review review) {
        Review newReview = reviewService.addHotelReview(hotelId, review);
        return ResponseEntity.ok(newReview);
    }

    @PostMapping("/{productId}/{reviewId}/reply")
    public ResponseEntity<?> addReplyToReview(
            @PathVariable String productId,
            @PathVariable String reviewId,
            @RequestParam String type,
            @RequestBody Reply reply) {
        reviewService.addReplyToReview(productId, reviewId, type, reply);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{productId}/{reviewId}/helpful")
    public ResponseEntity<?> markAsHelpful(
            @PathVariable String productId,
            @PathVariable String reviewId,
            @RequestParam String type,
            @RequestBody Map<String, String> payload) {
        String userId = payload.get("userId");
        reviewService.markReviewAsHelpful(productId, reviewId, type, userId);
        return ResponseEntity.ok().build();
    }
}