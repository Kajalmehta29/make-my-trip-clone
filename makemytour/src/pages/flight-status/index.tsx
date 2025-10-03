import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getFlightStatus } from "@/api";
import FlightStatusCard from "@/components/FlightStatusCard";
import Loader from "@/components/Loader";

const FlightStatusPage = () => {
  const [flightNumber, setFlightNumber] = useState("");
  const [flightStatus, setFlightStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setFlightStatus(null);
    try {
      const data = await getFlightStatus(flightNumber);
      setFlightStatus(data);
    } catch (err) {
      setError("Flight not found or an error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-6 text-black">
          Live Flight Status
        </h1>
        <form
          onSubmit={handleSearch}
          className="flex flex-col sm:flex-row gap-4 mb-8"
        >
          <div className="flex-1">
            <Label htmlFor="flightNumber" className="sr-only">
              Flight Number
            </Label>
            <Input
              id="flightNumber"
              type="text"
              placeholder="e.g., IX 2747"
              value={flightNumber}
              onChange={(e) => setFlightNumber(e.target.value)}
              required
              className="text-white"
            />
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? "Searching..." : "Search Flight"}
          </Button>
        </form>

        {loading && <Loader />}
        {error && <p className="text-red-500 text-center">{error}</p>}
        {flightStatus && <FlightStatusCard status={flightStatus} />}
      </div>
    </div>
  );
};

export default FlightStatusPage;