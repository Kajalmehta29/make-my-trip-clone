package com.makemytrip.makemytrip.controllers;

import com.makemytrip.makemytrip.models.Flight;
import com.makemytrip.makemytrip.models.Hotel;
import com.makemytrip.makemytrip.models.Users;
import com.makemytrip.makemytrip.models.Seat;
import com.makemytrip.makemytrip.models.RoomType;
import com.makemytrip.makemytrip.repositories.FlightRepository;
import com.makemytrip.makemytrip.repositories.HotelRepository;
import com.makemytrip.makemytrip.repositories.UserRepository;
import com.makemytrip.makemytrip.services.FileStorageService;
import com.makemytrip.makemytrip.services.PriceHistoryService;
import com.makemytrip.makemytrip.services.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
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
    
    @Autowired
    private PriceHistoryService priceHistoryService;


    @GetMapping("/users")
    public ResponseEntity<List<Users>> getallusers(){
        List<Users> users=userRepository.findAll();
        return ResponseEntity.ok(users);
    }
    @PostMapping("/flight")
    public Flight addflight(@RequestBody Flight flight){
        List<Seat> seats = new ArrayList<>();
        for (int i = 1; i <= 30; i++) {
            Seat seat = new Seat();
            seat.setSeatNumber(String.valueOf(i));
            seat.setIsAvailable(true);
            seat.setIsPremium(i % 10 == 0); 
            seat.setPrice(seat.getIsPremium() ? 500 : 0);
            seats.add(seat);
        }
        flight.setSeats(seats);
        return flightRepository.save(flight);
    }

    @PostMapping("/hotel")
    public Hotel addhotel(@RequestBody Hotel hotel){
        List<RoomType> roomTypes = new ArrayList<>();
        
        RoomType standard = new RoomType();
        standard.setTypeName("Standard Room");
        standard.setPrice(hotel.getPricePerNight());
        standard.setAvailability(10);
        roomTypes.add(standard);

        RoomType deluxe = new RoomType();
        deluxe.setTypeName("Deluxe Room");
        deluxe.setPrice(hotel.getPricePerNight() + 2000);
        deluxe.setAvailability(5);
        roomTypes.add(deluxe);

        hotel.setRoomTypes(roomTypes);
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

    @PostMapping("/record-history")
    public ResponseEntity<String> recordPriceHistory() {
        priceHistoryService.recordPriceHistory();
        return ResponseEntity.ok("Price history recorded successfully.");
    }
}