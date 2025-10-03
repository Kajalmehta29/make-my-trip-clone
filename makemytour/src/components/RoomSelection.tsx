import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface RoomTypeCardProps {
  roomType: {
    typeName: string;
    price: number;
    availability: number;
    threeDPreviewUrl?: string;
  };
  onSelect: (typeName: string) => void;
  isSelected: boolean;
  isPreferred: boolean;
}

const RoomTypeCard: React.FC<RoomTypeCardProps> = ({ roomType, onSelect, isSelected, isPreferred }) => {
  const getBorderStyle = () => {
    if (isSelected) return 'border-blue-500';
    if (isPreferred) return 'border-green-500';
    return '';
  };

  return (
    <div
      className={`border-2 p-4 rounded-md cursor-pointer ${getBorderStyle()}`}
      onClick={() => onSelect(roomType.typeName)}
    >
      <h3 className="font-semibold text-black">{roomType.typeName}</h3>
      <p className="text-black">Price: ₹{roomType.price}</p>
      <p className="text-gray-600">Available: {roomType.availability}</p>
      {roomType.threeDPreviewUrl && (
        <a
          href={roomType.threeDPreviewUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500"
        >
          3D Preview
        </a>
      )}
    </div>
  );
};

interface RoomSelectionProps {
  roomTypes: {
    typeName: string;
    price: number;
    availability: number;
    threeDPreviewUrl?: string;
  }[];
  onRoomSelected: (selectedRoom: string | null) => void;
  preferredRoomType?: string;
}

const RoomSelection: React.FC<RoomSelectionProps> = ({ roomTypes, onRoomSelected, preferredRoomType }) => {
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);

  const isPreferredRoom = (typeName: string) => {
    if (!preferredRoomType || preferredRoomType === 'any') return false;
    return typeName.toLowerCase().includes(preferredRoomType.toLowerCase());
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Select Room Type</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {roomTypes.map((roomType) => (
            <RoomTypeCard
              key={roomType.typeName}
              roomType={roomType}
              onSelect={setSelectedRoom}
              isSelected={selectedRoom === roomType.typeName}
              isPreferred={isPreferredRoom(roomType.typeName)}
            />
          ))}
        </div>
        <Button className="mt-4 w-full" onClick={() => onRoomSelected(selectedRoom)}>
          Confirm Room
        </Button>
      </CardContent>
    </Card>
  );
};

export default RoomSelection;