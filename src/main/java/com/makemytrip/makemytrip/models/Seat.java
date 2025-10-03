package com.makemytrip.makemytrip.models;

public class Seat {
    private String seatNumber;
    private boolean isAvailable;
    private boolean isPremium;
    private double price;

    // Getters and Setters
    public String getSeatNumber() {
        return seatNumber;
    }

    public void setSeatNumber(String seatNumber) {
        this.seatNumber = seatNumber;
    }

    public boolean getIsAvailable() {
        return isAvailable;
    }

    public void setIsAvailable(boolean isAvailable) {
        this.isAvailable = isAvailable;
    }

    public boolean getIsPremium() {
        return isPremium;
    }

    public void setIsPremium(boolean isPremium) {
        this.isPremium = isPremium;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }
}