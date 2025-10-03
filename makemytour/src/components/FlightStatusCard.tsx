import React from "react";
import { Plane, Clock, AlertTriangle, CheckCircle } from "lucide-react";

const FlightStatusCard = ({ status }) => {
  const getStatusIcon = () => {
    switch (status.status) {
      case "On Time":
        return <CheckCircle className="w-12 h-12 text-green-500" />;
      case "Delayed":
        return <AlertTriangle className="w-12 h-12 text-yellow-500" />;
      case "Departed":
        return <Plane className="w-12 h-12 text-blue-500" />;
      case "Arrived":
        return <CheckCircle className="w-12 h-12 text-indigo-500" />;
      default:
        return <Plane className="w-12 h-12 text-gray-500" />;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border text-black">
      <div className="flex flex-col sm:flex-row items-center gap-6">
        <div className="flex-shrink-0">{getStatusIcon()}</div>
        <div className="flex-1">
          <h2 className="text-2xl font-bold">Flight {status.flightNumber}</h2>
          <p className="text-xl font-semibold mt-1">{status.status}</p>
          {status.delayReason && (
            <p className="text-red-600 mt-2">
              <strong>Reason:</strong> {status.delayReason}
            </p>
          )}
          {status.estimatedArrivalTime && (
            <div className="flex items-center text-gray-700 mt-2">
              <Clock className="w-5 h-5 mr-2" />
              <span>
                <strong>New Estimated Arrival:</strong>{" "}
                {new Date(status.estimatedArrivalTime).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FlightStatusCard;