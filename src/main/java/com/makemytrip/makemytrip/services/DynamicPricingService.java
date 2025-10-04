package com.makemytrip.makemytrip.services;

import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

@Service
public class DynamicPricingService {

    // A simple list of holidays. In a real application, this might come from a database or an external API.
    private static final List<LocalDate> HOLIDAYS = Arrays.asList(
        LocalDate.of(2025, 10, 5), // Diwali
        LocalDate.of(2025, 12, 25)  // Christmas
    );

    private static final double HOLIDAY_SURCHARGE = 1.20; // 20% surcharge

    public double getDynamicPrice(double basePrice, LocalDate date) {
        if (HOLIDAYS.contains(date)) {
            return basePrice * HOLIDAY_SURCHARGE;
        }
        return basePrice;
    }
}