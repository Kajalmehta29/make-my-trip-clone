package com.makemytrip.makemytrip.controllers;
import com.makemytrip.makemytrip.models.Users;
import com.makemytrip.makemytrip.models.Flight;
import com.makemytrip.makemytrip.models.Hotel;
import com.makemytrip.makemytrip.repositories.UserRepository;
import com.makemytrip.makemytrip.repositories.FlightRepository;
import com.makemytrip.makemytrip.repositories.HotelRepository;
import com.makemytrip.makemytrip.services.DynamicPricingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@CrossOrigin(origins = "*")
public class RootController {
    @Autowired
    private HotelRepository hotelRepository;

    @Autowired
    private FlightRepository flightRepository;

    @Autowired
    private DynamicPricingService dynamicPricingService;

    @GetMapping("/")
    public String home() {
        return "✅ It's running on port 8080!";
    }

    @GetMapping("/hotel")
    public ResponseEntity<List<Hotel>> getallhotel(){
        List<Hotel> hotels=hotelRepository.findAll();
        // Apply dynamic pricing
        hotels.forEach(hotel -> {
            double dynamicPrice = dynamicPricingService.getDynamicPrice(hotel.getPricePerNight(), LocalDate.now());
            hotel.setPricePerNight(dynamicPrice);
        });
        return ResponseEntity.ok(hotels);
    }

    @GetMapping("/flight")
    public ResponseEntity<List<Flight>> getallflights(){
        List<Flight> flights=flightRepository.findAll();
        // Apply dynamic pricing
        flights.forEach(flight -> {
            LocalDate departureDate = LocalDateTime.parse(flight.getDepartureTime()).toLocalDate();
            double dynamicPrice = dynamicPricingService.getDynamicPrice(flight.getPrice(), departureDate);
            flight.setPrice(dynamicPrice);
        });
        return ResponseEntity.ok(flights);
    }

}