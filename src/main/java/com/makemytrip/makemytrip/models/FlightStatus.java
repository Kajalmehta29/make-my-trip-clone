package com.makemytrip.makemytrip.models;

public class FlightStatus {
    private String flightNumber;
    private String status;
    private String delayReason;
    private String estimatedArrivalTime;

    public FlightStatus(String flightNumber, String status, String delayReason, String estimatedArrivalTime) {
        this.flightNumber = flightNumber;
        this.status = status;
        this.delayReason = delayReason;
        this.estimatedArrivalTime = estimatedArrivalTime;
    }

    // Getters and Setters
    public String getFlightNumber() { return flightNumber; }
    public void setFlightNumber(String flightNumber) { this.flightNumber = flightNumber; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getDelayReason() { return delayReason; }
    public void setDelayReason(String delayReason) { this.delayReason = delayReason; }
    public String getEstimatedArrivalTime() { return estimatedArrivalTime; }
    public void setEstimatedArrivalTime(String estimatedArrivalTime) { this.estimatedArrivalTime = estimatedArrivalTime; }
}