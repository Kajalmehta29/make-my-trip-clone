import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PriceHistory {
  date: string;
  price: number;
}

interface PriceHistoryGraphProps {
  priceHistory: PriceHistory[];
}

const PriceHistoryGraph: React.FC<PriceHistoryGraphProps> = ({ priceHistory }) => {
  if (!priceHistory || priceHistory.length === 0) {
    return <p className='text-black'>No price history available.</p>;
  }

  const maxPrice = Math.max(...priceHistory.map(p => p.price));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Price History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-around items-end h-40">
          {priceHistory.map((entry, index) => (
            <div key={index} className="flex flex-col items-center">
              <div
                className="w-8 bg-blue-500"
                style={{ height: `${(entry.price / maxPrice) * 100}%` }}
              ></div>
              <span className="text-xs mt-1">{new Date(entry.date).toLocaleDateString()}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PriceHistoryGraph;