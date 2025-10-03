package com.makemytrip.makemytrip.models;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class Review {
    private String id;
    private String userId;
    private String userName;
    private int rating;
    private String comment;
    private List<String> imageUrls = new ArrayList<>();
    private List<Reply> replies = new ArrayList<>();
    private boolean isFlagged;
    private List<String> helpfulUserIds = new ArrayList<>(); // Changed from helpfulCount
    private Instant createdAt;

    public Review() {
        this.id = UUID.randomUUID().toString();
        this.createdAt = Instant.now();
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public int getRating() {
        return rating;
    }

    public void setRating(int rating) {
        this.rating = rating;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public List<String> getImageUrls() {
        return imageUrls;
    }

    public void setImageUrls(List<String> imageUrls) {
        this.imageUrls = imageUrls;
    }

    public List<Reply> getReplies() {
        return replies;
    }

    public void setReplies(List<Reply> replies) {
        this.replies = replies;
    }

    public boolean isFlagged() {
        return isFlagged;
    }

    public void setFlagged(boolean isFlagged) {
        this.isFlagged = isFlagged;
    }

    public List<String> getHelpfulUserIds() {
        return helpfulUserIds;
    }

    public void setHelpfulUserIds(List<String> helpfulUserIds) {
        this.helpfulUserIds = helpfulUserIds;
    }

    public int getHelpfulCount() {
        return this.helpfulUserIds.size();
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
}