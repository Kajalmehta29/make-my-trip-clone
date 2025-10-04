package com.makemytrip.makemytrip.models;

import java.time.LocalDate;

public class PriceHistory {
    private LocalDate date;
    private double price;

    public PriceHistory(LocalDate date, double price) {
        this.date = date;
        this.price = price;
    }

    // Getters and Setters
    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }
}