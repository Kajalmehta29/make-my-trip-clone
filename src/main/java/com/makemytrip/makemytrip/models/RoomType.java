package com.makemytrip.makemytrip.models;

public class RoomType {
    private String typeName;
    private double price;
    private int availability;
    private String threeDPreviewUrl;

    // Getters and Setters
    public String getTypeName() {
        return typeName;
    }

    public void setTypeName(String typeName) {
        this.typeName = typeName;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public int getAvailability() {
        return availability;
    }

    public void setAvailability(int availability) {
        this.availability = availability;
    }

    public String getThreeDPreviewUrl() {
        return threeDPreviewUrl;
    }

    public void setThreeDPreviewUrl(String threeDPreviewUrl) {
        this.threeDPreviewUrl = threeDPreviewUrl;
    }
}