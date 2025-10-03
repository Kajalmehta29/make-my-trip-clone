package com.makemytrip.makemytrip.services;

import com.makemytrip.makemytrip.models.Users;
import com.makemytrip.makemytrip.models.Users.Booking;
import com.makemytrip.makemytrip.models.Flight;
import com.makemytrip.makemytrip.models.Hotel;
import com.makemytrip.makemytrip.repositories.UserRepository;
import com.makemytrip.makemytrip.repositories.FlightRepository;
import com.makemytrip.makemytrip.repositories.HotelRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.Optional;

@Service
public class BookingService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FlightRepository flightRepository;

    @Autowired
    private HotelRepository hotelRepository;

    public Booking bookFlight(String userId, String flightId, int seats, double price) {
        Optional<Users> usersOptional = userRepository.findById(userId);
        Optional<Flight> flightOptional = flightRepository.findById(flightId);
        if (usersOptional.isPresent() && flightOptional.isPresent()) {
            Users user = usersOptional.get();
            Flight flight = flightOptional.get();
            if (flight.getAvailableSeats() >= seats) {
                flight.setAvailableSeats(flight.getAvailableSeats() - seats);
                flightRepository.save(flight);

                Booking booking = new Booking();
                booking.setProductId(flightId);
                booking.setType("Flight");
                booking.setDate(LocalDate.now().toString());
                booking.setCheckInDate(flight.getDepartureTime());
                booking.setQuantity(seats);
                booking.setTotalPrice(price);
                user.getBookings().add(booking);
                userRepository.save(user);
                return booking;
            } else {
                throw new RuntimeException("Not enough seats available");
            }
        }
        throw new RuntimeException("User or flight not found");
    }

    public Booking bookhotel(String userId, String hotelId, int rooms, double price, String checkInDate) {
        Optional<Users> usersOptional = userRepository.findById(userId);
        Optional<Hotel> hotelOptional = hotelRepository.findById(hotelId);
        if (usersOptional.isPresent() && hotelOptional.isPresent()) {
            Users user = usersOptional.get();
            Hotel hotel = hotelOptional.get();
            if (hotel.getAvailableRooms() >= rooms) {
                hotel.setAvailableRooms(hotel.getAvailableRooms() - rooms);
                hotelRepository.save(hotel);

                Booking booking = new Booking();
                booking.setProductId(hotelId);
                booking.setType("Hotel");
                booking.setDate(LocalDate.now().toString());
                booking.setCheckInDate(checkInDate);
                booking.setQuantity(rooms);
                booking.setTotalPrice(price);
                user.getBookings().add(booking);
                userRepository.save(user);
                return booking;
            } else {
                throw new RuntimeException("Not enough rooms available");
            }
        }
        throw new RuntimeException("User or hotel not found");
    }

    public Booking cancelBooking(String userId, String bookingId, String cancellationReason) {
        Optional<Users> usersOptional = userRepository.findById(userId);
        if (usersOptional.isPresent()) {
            Users user = usersOptional.get();
            Optional<Booking> bookingOptional = user.getBookings().stream()
                    .filter(b -> b.getBookingId().equals(bookingId)).findFirst();

            if (bookingOptional.isPresent()) {
                Booking booking = bookingOptional.get();

                double refundPercentage = 0.0;
                String policy = "";

                if (booking.getType().equals("Flight")) {
                    Optional<Flight> flightOptional = flightRepository.findById(booking.getProductId());
                    if (flightOptional.isPresent()) {
                        Flight flight = flightOptional.get();
                        policy = flight.getCancellationPolicy();

                        // **FIX: Check if departureTime is valid before parsing**
                        if (flight.getDepartureTime() == null || flight.getDepartureTime().isEmpty()) {
                            throw new RuntimeException("Flight departure time is not set. Cannot process cancellation.");
                        }

                        LocalDateTime departureTime = LocalDateTime.parse(flight.getDepartureTime(), DateTimeFormatter.ISO_LOCAL_DATE_TIME);
                        long hoursUntilDeparture = ChronoUnit.HOURS.between(LocalDateTime.now(), departureTime);

                        if ("Strict".equals(policy)) {
                            if (hoursUntilDeparture > 72) refundPercentage = 0.8; // 80% refund
                            else if (hoursUntilDeparture > 24) refundPercentage = 0.4; // 40% refund
                        } else { // Default "Flexible" policy
                            if (hoursUntilDeparture > 24) refundPercentage = 1.0; // 100% refund
                            else if (hoursUntilDeparture > 6) refundPercentage = 0.5; // 50% refund
                        }
                    }
                } else if (booking.getType().equals("Hotel")) {
                    Optional<Hotel> hotelOptional = hotelRepository.findById(booking.getProductId());
                    if (hotelOptional.isPresent()) {
                        Hotel hotel = hotelOptional.get();
                        policy = hotel.getCancellationPolicy();

                        // **FIX: Check if checkInDate is valid before parsing**
                        if (booking.getCheckInDate() == null || booking.getCheckInDate().isEmpty()) {
                            throw new RuntimeException("Hotel check-in date is not set. Cannot process cancellation.");
                        }

                        LocalDate checkInDate = LocalDate.parse(booking.getCheckInDate(), DateTimeFormatter.ISO_LOCAL_DATE);
                        long daysUntilCheckIn = ChronoUnit.DAYS.between(LocalDate.now(), checkInDate);

                        if ("Strict".equals(policy)) {
                            if (daysUntilCheckIn > 7) refundPercentage = 0.75; // 75% refund
                            else if (daysUntilCheckIn > 2) refundPercentage = 0.30; // 30% refund
                        } else { // Default "Flexible" policy
                            if (daysUntilCheckIn > 3) refundPercentage = 1.0; // 100% refund
                            else if (daysUntilCheckIn > 1) refundPercentage = 0.5; // 50% refund
                        }
                    }
                }

                double refundAmount = booking.getTotalPrice() * refundPercentage;

                booking.setCancelled(true);
                booking.setCancellationReason(cancellationReason);
                booking.setRefundAmount(refundAmount);
                booking.setRefundStatus("Processed");

                userRepository.save(user);
                return booking;
            } else {
                throw new RuntimeException("Booking not found");
            }
        }
        throw new RuntimeException("User not found");
    }
}