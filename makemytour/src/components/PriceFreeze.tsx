import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PriceFreezeProps {
  price: number;
  onFreeze: () => void;
}

const PriceFreeze: React.FC<PriceFreezeProps> = ({ price, onFreeze }) => {
  const [isFrozen, setIsFrozen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    if (isFrozen && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [isFrozen, timeLeft]);

  const handleFreeze = () => {
    setIsFrozen(true);
    setTimeLeft(600); // Freeze for 10 minutes (600 seconds)
    onFreeze();
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Price Freeze</CardTitle>
      </CardHeader>
      <CardContent>
        {isFrozen ? (
          <div className='text-black'>
            <p>Price frozen at ₹{price}!</p>
            <p>Time left: {formatTime(timeLeft)}</p>
          </div>
        ) : (
          <Button onClick={handleFreeze} className="w-full">
            Freeze Price for 10 minutes
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default PriceFreeze;