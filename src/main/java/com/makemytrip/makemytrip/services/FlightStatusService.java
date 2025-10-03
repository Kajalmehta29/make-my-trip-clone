package com.makemytrip.makemytrip.services;

import com.makemytrip.makemytrip.models.Flight;
import com.makemytrip.makemytrip.models.FlightStatus;
import com.makemytrip.makemytrip.repositories.FlightRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Random;

@Service
public class FlightStatusService {

    @Autowired
    private FlightRepository flightRepository;

    private final Random random = new Random();

    public FlightStatus getMockFlightStatus(String flightNumber) {
        // In a real application, you would query an external flight status API here.
        // For this mock, we will generate a random status.

        String[] statuses = {"On Time", "Delayed", "Departed", "Arrived"};
        String[] reasons = {"Technical Issue", "Weather Conditions", "Air Traffic Congestion", "Crew Shortage"};

        String status = statuses[random.nextInt(statuses.length)];
        String delayReason = null;
        String estimatedArrival = null;

        if ("Delayed".equals(status)) {
            delayReason = reasons[random.nextInt(reasons.length)];
            // Find the original flight to calculate a new estimated arrival
            Flight flight = flightRepository.findAll().stream()
                .filter(f -> flightNumber.equals(f.getFlightNumber()))
                .findFirst()
                .orElse(null);

            if (flight != null && flight.getArrivalTime() != null) {
                LocalDateTime arrival = LocalDateTime.parse(flight.getArrivalTime(), DateTimeFormatter.ISO_LOCAL_DATE_TIME);
                estimatedArrival = arrival.plusHours(1).format(DateTimeFormatter.ISO_LOCAL_DATE_TIME);
            }
        }

        return new FlightStatus(flightNumber, status, delayReason, estimatedArrival);
    }
}
