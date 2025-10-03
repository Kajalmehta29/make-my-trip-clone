package com.makemytrip.makemytrip.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "hotels")
public class Hotel {
    @Id
    private String _id;
    private String hotelName;
    private String location;
    private double pricePerNight;
    private int availableRooms;
    private String amenities;
    private String cancellationPolicy;
    private List<Review> reviews = new ArrayList<>();

    // Getters and Setters
    public List<Review> getReviews() {
        return reviews;
    }

    public void setReviews(List<Review> reviews) {
        this.reviews = reviews;
    }

    public String getCancellationPolicy() {
        return cancellationPolicy;
    }

    public void setCancellationPolicy(String cancellationPolicy) {
        this.cancellationPolicy = cancellationPolicy;
    }

    public String getId() {
        return _id;
    }

    public void setId(String id) {
        this._id = id;
    }

    public void setamenities(String amenities) {
        this.amenities = amenities;
    }

    public String getamenities() {
        return amenities;
    }

    public String gethotelName() {
        return hotelName;
    }

    public void sethotelName(String hotelName) {
        this.hotelName = hotelName;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public int getAvailableRooms() {
        return availableRooms;
    }

    public void setAvailableRooms(int availableRooms) {
        this.availableRooms = availableRooms;
    }

    public double getPricePerNight() {
        return pricePerNight;
    }

    public void setPricePerNight(double pricePerNight) {
        this.pricePerNight = pricePerNight;
    }
}