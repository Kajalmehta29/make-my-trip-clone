import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface SeatProps {
  seat: {
    seatNumber: string;
    isAvailable: boolean;
    isPremium: boolean;
  };
  onSelect: (seatNumber: string) => void;
  isSelected: boolean;
  isPreferred: boolean;
}

const Seat: React.FC<SeatProps> = ({ seat, onSelect, isSelected, isPreferred }) => {
  const getSeatStyle = () => {
    if (!seat.isAvailable) return 'bg-gray-400 cursor-not-allowed';
    if (isSelected) return 'bg-blue-500 text-white';
    if (isPreferred) return 'ring-2 ring-green-500 bg-gray-200';
    if (seat.isPremium) return 'bg-yellow-400';
    return 'bg-gray-200 hover:bg-gray-300';
  };

  return (
    <div
      className={`w-10 h-10 flex items-center justify-center rounded-md cursor-pointer ${getSeatStyle()}`}
      onClick={() => seat.isAvailable && onSelect(seat.seatNumber)}
    >
      {seat.seatNumber}
    </div>
  );
};

interface SeatSelectionProps {
  seats: {
    seatNumber: string;
    isAvailable: boolean;
    isPremium: boolean;
  }[];
  onSeatsSelected: (selectedSeats: string[]) => void;
  preferredSeatType?: string;
}

const SeatSelection: React.FC<SeatSelectionProps> = ({ seats, onSeatsSelected, preferredSeatType }) => {
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

  const handleSelectSeat = (seatNumber: string) => {
    setSelectedSeats((prev) =>
      prev.includes(seatNumber)
        ? prev.filter((s) => s !== seatNumber)
        : [...prev, seatNumber]
    );
  };

  const isPreferredSeat = (seatNumber: string) => {
    if (!preferredSeatType || preferredSeatType === 'any') return false;
    if (preferredSeatType === 'window' && (seatNumber.endsWith('A') || seatNumber.endsWith('F'))) {
      return true;
    }
    if (preferredSeatType === 'aisle' && (seatNumber.endsWith('C') || seatNumber.endsWith('D'))) {
      return true;
    }
    return false;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Select Your Seats</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap justify-around mb-4 text-sm gap-2">
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-sm mr-2 ring-2 ring-green-500"></div>
            <span>Preferred</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-blue-500 rounded-sm mr-2"></div>
            <span>Selected</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-yellow-400 rounded-sm mr-2"></div>
            <span>Premium</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-gray-200 rounded-sm mr-2"></div>
            <span>Available</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-gray-400 rounded-sm mr-2"></div>
            <span>Booked</span>
          </div>
        </div>

        <div className="grid grid-cols-6 gap-2">
          {seats.map((seat) => (
            <Seat
              key={seat.seatNumber}
              seat={seat}
              onSelect={handleSelectSeat}
              isSelected={selectedSeats.includes(seat.seatNumber)}
              isPreferred={isPreferredSeat(seat.seatNumber)}
            />
          ))}
        </div>

        <div className="mt-4">
          <p className='text-black'>Selected seats ({selectedSeats.length}): {selectedSeats.join(', ')}</p>
        </div>

        <Button className="mt-4 w-full" onClick={() => onSeatsSelected(selectedSeats)}>
          Confirm Seats & Update Price
        </Button>
      </CardContent>
    </Card>
  );
};

export default SeatSelection;