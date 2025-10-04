package com.makemytrip.makemytrip.services;

import com.makemytrip.makemytrip.models.Flight;
import com.makemytrip.makemytrip.models.Hotel;
import com.makemytrip.makemytrip.models.PriceHistory;
import com.makemytrip.makemytrip.repositories.FlightRepository;
import com.makemytrip.makemytrip.repositories.HotelRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class PriceHistoryService {

    @Autowired
    private FlightRepository flightRepository;

    @Autowired
    private HotelRepository hotelRepository;

    // Run this method every day at midnight
    @Scheduled(cron = "0 0 0 * * ?")
    public void recordPriceHistory() {
        // Record flight prices
        List<Flight> flights = flightRepository.findAll();
        for (Flight flight : flights) {
            flight.getPriceHistory().add(new PriceHistory(LocalDate.now(), flight.getPrice()));
            flightRepository.save(flight);
        }

        // Record hotel prices
        List<Hotel> hotels = hotelRepository.findAll();
        for (Hotel hotel : hotels) {
            hotel.getPriceHistory().add(new PriceHistory(LocalDate.now(), hotel.getPricePerNight()));
            hotelRepository.save(hotel);
        }
    }
}