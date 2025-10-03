package com.makemytrip.makemytrip.controllers;

import com.makemytrip.makemytrip.models.Flight;
import com.makemytrip.makemytrip.models.Hotel;
import com.makemytrip.makemytrip.models.Users;
import com.makemytrip.makemytrip.repositories.FlightRepository;
import com.makemytrip.makemytrip.repositories.HotelRepository;
import com.makemytrip.makemytrip.repositories.UserRepository;
import com.makemytrip.makemytrip.services.FileStorageService;
import com.makemytrip.makemytrip.services.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/admin")
@CrossOrigin(origins = "*")
public class AdminController {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private HotelRepository hotelRepository;

    @Autowired
    private FlightRepository flightRepository;

    @Autowired
    private ReviewService reviewService;

    @Autowired
    private FileStorageService fileStorageService;


    @GetMapping("/users")
    public ResponseEntity<List<Users>> getallusers(){
        List<Users> users=userRepository.findAll();
        return ResponseEntity.ok(users);
    }
    @PostMapping("/flight")
    public Flight addflight(@RequestBody Flight flight){
        return flightRepository.save(flight);
    }

    @PostMapping("/hotel")
    public Hotel addhotel(@RequestBody Hotel hotel){
        return hotelRepository.save(hotel);
    }
    @PutMapping("flight/{id}")
    public ResponseEntity<Flight> editflight(@PathVariable String id, @RequestBody Flight updatedFlight){
        Optional<Flight> flightOptional=flightRepository.findById(id);
        if(flightOptional.isPresent()){
            Flight flight = flightOptional.get();
            flight.setFlightName(updatedFlight.getFlightName());
            flight.setFrom(updatedFlight.getFrom());
            flight.setTo(updatedFlight.getTo());
            flight.setDepartureTime(updatedFlight.getDepartureTime());
            flight.setArrivalTime(updatedFlight.getArrivalTime());
            flight.setPrice(updatedFlight.getPrice());
            flight.setAvailableSeats(updatedFlight.getAvailableSeats());
            flightRepository.save(flight);
            return  ResponseEntity.ok(flight);
        }
        return ResponseEntity.notFound().build();
    }
    @PutMapping("hotel/{id}")
    public ResponseEntity<Hotel> editHotel (@PathVariable String id, @RequestBody Hotel updatedHotel){
        Optional<Hotel> hotelOptional=hotelRepository.findById(id);
        if(hotelOptional.isPresent()){
            Hotel hotel = hotelOptional.get();
            hotel.sethotelName(updatedHotel.gethotelName());
            hotel.setLocation(updatedHotel.getLocation());
            hotel.setAvailableRooms(updatedHotel.getAvailableRooms());
            hotel.setPricePerNight(updatedHotel.getPricePerNight());
            hotel.setamenities((updatedHotel.getamenities()));
            hotelRepository.save(hotel);
            return ResponseEntity.ok(hotel);
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/review/flag")
    public ResponseEntity<?> flagReview(@RequestBody Map<String, String> payload) {
        String productId = payload.get("productId");
        String reviewId = payload.get("reviewId");
        String type = payload.get("type");
        reviewService.flagReview(productId, reviewId, type);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/upload")
    public ResponseEntity<Map<String, String>> uploadFile(@RequestParam("file") MultipartFile file) {
        String fileName = fileStorageService.storeFile(file);
        String fileDownloadUri = "/uploads/" + fileName;
        return ResponseEntity.ok(Map.of("url", fileDownloadUri));
    }
}