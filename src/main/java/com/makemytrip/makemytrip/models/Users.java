package com.makemytrip.makemytrip.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;
import java.util.ArrayList;
import java.util.UUID;

@Document(collection = "users")
public class Users {
    @Id
    private String _id;
    private String firstName;
    private String lastName;
    private String email;
    private String password;
    private String role;
    private String phoneNumber;
    private List<Booking> bookings = new ArrayList<>();
    private String preferredSeatType; // e.g., "window", "aisle"
    private String preferredRoomType; // e.g., "king", "sea-view"

    // Existing Getters and Setters...

    public String getFirstName() {
        return firstName;
    }

    public String getId() {
        return _id;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public String getPassword() {
        return password;
    }

    public String getEmail() {
        return email;
    }

    public String getRole() {
        return role;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public List<Booking> getBookings() {
        return bookings;
    }

    public void setBookings(List<Booking> bookings) {
        this.bookings = bookings;
    }
    
    // New Getters and Setters for preferences
    public String getPreferredSeatType() {
        return preferredSeatType;
    }

    public void setPreferredSeatType(String preferredSeatType) {
        this.preferredSeatType = preferredSeatType;
    }

    public String getPreferredRoomType() {
        return preferredRoomType;
    }

    public void setPreferredRoomType(String preferredRoomType) {
        this.preferredRoomType = preferredRoomType;
    }


    public static class Booking {
        private String bookingId;
        private String productId;
        private String type;
        private String date;
        private String checkInDate; 
        private int quantity;
        private double totalPrice;
        private boolean cancelled;
        private String cancellationReason;
        private double refundAmount;
        private String refundStatus;
        private List<String> selectedSeats = new ArrayList<>(); 
        private String selectedRoomType; 

        public Booking() {
            this.bookingId = UUID.randomUUID().toString();
        }

        // Getters and Setters for Booking...
        public String getBookingId() { return bookingId; }
        public void setBookingId(String bookingId) { this.bookingId = bookingId; }
        public String getProductId() { return productId; }
        public void setProductId(String productId) { this.productId = productId; }
        public String getType() { return type; }
        public void setType(String type) { this.type = type; }
        public String getDate() { return date; }
        public void setDate(String date) { this.date = date; }
        public String getCheckInDate() { return checkInDate; }
        public void setCheckInDate(String checkInDate) { this.checkInDate = checkInDate; }
        public int getQuantity() { return quantity; }
        public void setQuantity(int quantity) { this.quantity = quantity; }
        public double getTotalPrice() { return totalPrice; }
        public void setTotalPrice(double totalPrice) { this.totalPrice = totalPrice; }
        public boolean isCancelled() { return cancelled; }
        public void setCancelled(boolean cancelled) { this.cancelled = cancelled; }
        public String getCancellationReason() { return cancellationReason; }
        public void setCancellationReason(String cancellationReason) { this.cancellationReason = cancellationReason; }
        public double getRefundAmount() { return refundAmount; }
        public void setRefundAmount(double refundAmount) { this.refundAmount = refundAmount; }
        public String getRefundStatus() { return refundStatus; }
        public void setRefundStatus(String refundStatus) { this.refundStatus = refundStatus; }
        public List<String> getSelectedSeats() { return selectedSeats; }
        public void setSelectedSeats(List<String> selectedSeats) { this.selectedSeats = selectedSeats; }
        public String getSelectedRoomType() { return selectedRoomType; }
        public void setSelectedRoomType(String selectedRoomType) { this.selectedRoomType = selectedRoomType; }
    }
}