package com.makemytrip.makemytrip.controllers;

import com.makemytrip.makemytrip.models.FlightStatus;
import com.makemytrip.makemytrip.services.FlightStatusService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/flight-status")
@CrossOrigin(origins = "*")
public class FlightStatusController {

    @Autowired
    private FlightStatusService flightStatusService;

    @GetMapping("/{flightNumber}")
    public ResponseEntity<FlightStatus> getFlightStatus(@PathVariable String flightNumber) {
        FlightStatus status = flightStatusService.getMockFlightStatus(flightNumber);
        return ResponseEntity.ok(status);
    }
}