import { useRouter } from "next/router";
import {
  Plane,
  Luggage,
  Clock,
  Calendar,
  MapPin,
  Gift,
  CreditCard,
  AlertCircle,
  ChevronRight,
  Star,
  Info,
  ArrowRight,
} from "lucide-react";
import ReviewList from "@/components/ReviewList";
import { useEffect, useState } from "react";
import { getflight, handleflightbooking } from "@/api";
import { useDispatch, useSelector } from "react-redux";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Users, Ticket } from "lucide-react";
import SignupDialog from "@/components/SignupDialog";
import Loader from "@/components/Loader";
import { setUser } from "@/store";

// Define the Review interface
interface Review {
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
  helpfulCount: number;
}

// Update the Flight interface to include reviews
interface Flight {
  id: string;
  flightName: string;
  from: string;
  to: string;
  departureTime: string;
  arrivalTime: string;
  price: number;
  availableSeats: number;
  reviews?: Review[]; // Make reviews optional as they might not exist
}

const BookFlightPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [open, setopem] = useState(false);
  const user = useSelector((state: any) => state.user.user);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchFlights = async () => {
      if (!id) return;
      try {
        const data = await getflight();
        // FIX: Ensure data is an array before filtering
        if (Array.isArray(data)) {
          const filteredData = data.filter((flight: any) => flight.id === id);
          setFlights(filteredData);
        } else {
          setFlights([]);
        }
      } catch (error) {
        console.error("Error fetching flights:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFlights();
  }, [id]);

  if (loading) {
    return <Loader />;
  }
  if (flights.length === 0) {
    return <div>No flight data available for this ID.</div>;
  }

  const flight = flights[0];

  const averageRating =
    flight.reviews && flight.reviews.length > 0
      ? (
          flight.reviews.reduce((acc, review) => acc + review.rating, 0) /
          flight.reviews.length
        ).toFixed(1)
      : "No ratings yet";

  const flightDetails = {
    duration: "3h 0m",
    aircraft: "Airbus A320",
    cabinBaggage: "7 Kgs / Adult",
    checkInBaggage: "15 Kgs (1 piece only) / Adult",
  };

  const fareSummary = {
    taxes: 1374,
    otherServices: 249,
    discounts: -250,
  };

    const hotels = [
        {
            name: "Hotel Park Tree",
            rating: 4,
            price: 9000,
            image:
                "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800",
            location: "Near Airport, New Delhi",
        },
        {
            name: "Lemon Tree Premier",
            rating: 4,
            price: 43875,
            image:
                "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800",
            location: "Connaught Place, New Delhi",
        },
        {
            name: "Hotel Kian",
            rating: 4,
            price: 1968,
            image:
                "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800",
            location: "Karol Bagh, New Delhi",
        },
    ];

  const formatDate = (dateString: string): string => {
    if (!dateString) return "N/A";
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    const date = new Date(dateString);
    return date.toLocaleString("en-US", options);
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const value = Number.parseInt(e.target.value);
    setQuantity(
      isNaN(value) ? 1 : Math.max(1, Math.min(value, flight.availableSeats))
    );
  };

  const totalPrice = flight?.price * quantity;
  const totalTaxes = fareSummary?.taxes * quantity;
  const totalOtherServices = fareSummary?.otherServices * quantity;
  const totalDiscounts = fareSummary?.discounts * quantity;
  const grandTotal =
    totalPrice + totalTaxes + totalOtherServices - totalDiscounts;

  const handlebooking = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await handleflightbooking(
        user?.id,
        flight?.id,
        quantity,
        grandTotal
      );
      const updateuser = {
        ...user,
        bookings: [...(user.bookings || []), data],
      };
      dispatch(setUser(updateuser));
      setopem(false);
      setQuantity(1);
      router.push("/profile");
    } catch (error) {
      console.log(error);
    }
  };

  const BookingContent = () => (
    <DialogContent className="sm:max-w-[600px] bg-white">
      <DialogHeader>
        <DialogTitle className="text-2xl font-bold flex items-center">
          <Plane className="w-6 h-6 mr-2" />
          Flight Booking Details
        </DialogTitle>
      </DialogHeader>
      <div className="grid gap-6 mt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="text-black space-y-2">
            <Label htmlFor="flightName" className="flex items-center">
              <Plane className="w-4 h-4 mr-2" />
              Flight Name
            </Label>
            <Input id="flightName" value={flight?.flightName} readOnly />
          </div>
          <div className="text-black space-y-2">
            <Label htmlFor="from" className="flex items-center">
              <MapPin className="w-4 h-4 mr-2" />
              From
            </Label>
            <Input id="from" value={flight?.from} readOnly />
          </div>
          <div className="text-black space-y-2">
            <Label htmlFor="to" className="flex items-center">
              <MapPin className="w-4 h-4 mr-2" />
              To
            </Label>
            <Input id="to" value={flight?.to} readOnly />
          </div>
          <div className=" text-black space-y-2">
            <Label htmlFor="departureTime" className="flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              Departure Time
            </Label>
            <Input
              id="departureTime"
              value={new Date(flight.departureTime).toLocaleString()}
              readOnly
            />
          </div>
          <div className="text-black space-y-2">
            <Label htmlFor="arrivalTime" className="flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              Arrival Time
            </Label>
            <Input
              id="arrivalTime"
              value={new Date(flight.arrivalTime).toLocaleString()}
              readOnly
            />
          </div>
          <div className="text-black space-y-2">
            <Label htmlFor="quantity" className="flex items-center">
              <Ticket className="w-4 h-4 mr-2" />
              Number of Tickets
            </Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              max={flight.availableSeats}
              value={quantity}
              onChange={handleQuantityChange}
            />
          </div>
        </div>
        <div className="bg-gray-100 rounded-lg p-4">
          <h3 className="text-black font-bold mb-4 flex items-center">
            <CreditCard className=" text-black w-5 h-5 mr-2" />
            Fare Summary
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Base Fare</span>
              <span className="text-black font-medium">
                ₹ {totalPrice.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Taxes and Surcharges</span>
              <span className="text-black font-medium">
                ₹ {totalTaxes.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Other Services</span>
              <span className="text-black font-medium">
                ₹ {totalOtherServices.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center text-green-600">
              <span className="font-medium">Discounts</span>
              <span className="font-medium">
                - ₹ {Math.abs(totalDiscounts).toLocaleString()}
              </span>
            </div>
            <div className="border-t pt-2 mt-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-black">Total Amount</span>
                <span className="font-bold text-black">
                  ₹ {grandTotal.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Button className="w-full mt-4" onClick={handlebooking}>
        Proceed to Payment
      </Button>
    </DialogContent>
  );
  return (
    <div className="min-h-screen bg-[#f4f7fa]">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
                <div>
                  <div className="flex items-center flex-wrap gap-4 mb-2">
                    <h2 className="text-black font-bold flex items-center">
                      <span>{flight?.from}</span>
                      <ArrowRight className="w-5 h-5 mx-2" />
                      <span>{flight?.to}</span>
                    </h2>
                    <span className="bg-green-100 text-green-600 text-xs px-3 py-1 rounded-full font-medium">
                      CANCELLATION FEES APPLY
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>{formatDate(flight.departureTime)}</span>
                    <span className="mx-2">•</span>
                    <Clock className="w-4 h-4 mr-2" />
                    <span>Non Stop - {flightDetails.duration}</span>
                  </div>
                </div>
                <button className="text-blue-600 text-sm font-medium hover:text-blue-700 flex items-center">
                  <Info className="w-4 h-4 mr-1" />
                  View Fare Rules
                </button>
              </div>

              <div className="flex items-center space-x-4 mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Plane className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <div className="font-semibold text-black">
                    {flight.flightName}
                  </div>
                  <div className="text-sm text-gray-600">
                    {flightDetails.aircraft}
                  </div>
                </div>
                <div className="ml-auto text-sm">
                  <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full">
                    Economy
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap md:flex-nowrap justify-between items-start gap-6 border-t pt-6">
                <div>
                  <div className="text-2xl font-bold text-black">
                    {formatDate(flight.departureTime)}
                  </div>
                  <div className="text-sm text-gray-600 mt-1 flex items-start">
                    <MapPin className="w-4 h-4 mr-1 flex-shrink-0 mt-0.5" />
                    {flight.from} International Airport, Terminal T2
                  </div>
                </div>
                <div className="text-center flex-shrink-0">
                  <div className="text-sm text-gray-600 mb-1">
                    {flightDetails.duration}
                  </div>
                  <div className="w-32 h-0.5 bg-gray-300 relative my-2">
                    <div className="absolute -top-2 right-0 w-4 h-4 rounded-full bg-gray-300 flex items-center justify-center">
                      <Plane className="w-3 h-3 text-gray-600" />
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">Non-stop</div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-black">
                    {formatDate(flight.arrivalTime)}
                  </div>
                  <div className="text-sm text-gray-600 mt-1 flex items-start justify-end">
                    <MapPin className="w-4 h-4 mr-1 flex-shrink-0 mt-0.5" />
                    {flight.to} International Airport, Terminal T3
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-6 mt-6 text-sm text-gray-600">
                <div className="flex items-center">
                  <Luggage className="w-5 h-5 mr-2 text-gray-500" />
                  <span>Cabin Baggage: {flightDetails.cabinBaggage}</span>
                </div>
                <div className="flex items-center">
                  <Luggage className="w-5 h-5 mr-2 text-gray-500" />
                  <span>
                    Check-in Baggage: {flightDetails.checkInBaggage}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-black font-bold flex items-center">
                  <Gift className="w-5 h-5 mr-2 text-red-500" />
                  Book a Flight & unlock these offers
                </h2>
                <span className="bg-red-100 text-red-600 text-xs px-3 py-1 rounded-full font-medium">
                  Flyer Exclusive Deal
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {hotels.map((hotel, index) => (
                  <div
                    key={index}
                    className="bg-white border rounded-xl overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="relative">
                      <img
                        src={hotel.image}
                        alt={hotel.name}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-3 right-3 bg-white text-black px-2 py-1 rounded-full text-xs font-medium">
                        Best Seller
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-black mb-1">
                        {hotel.name}
                      </h3>
                      <div className="flex items-center text-sm text-gray-600 mb-2">
                        <MapPin className="w-4 h-4 mr-1" />
                        {hotel.location}
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-yellow-400">
                          {[...Array(hotel.rating)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-current" />
                          ))}
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-gray-500">
                            Starting from
                          </div>
                          <div className="font-bold text-black">
                            ₹ {hotel.price.toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 mt-6">
              <h2 className="text-2xl text-black font-bold mb-2">
                Ratings & Reviews
              </h2>
              <div className="flex items-center mb-6">
                <Star className="w-6 h-6 text-yellow-400 fill-current mr-2" />
                <span className="text-xl font-bold text-black">
                  {averageRating}
                </span>
                <span className="text-gray-500 ml-2">
                  ({flight.reviews?.length || 0} reviews)
                </span>
              </div>
              <ReviewList
                reviews={flight.reviews ?? []}
                user={user}
                productId={flight.id}
                type="Flight"
              />
            </div>
          </div>
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <h2 className="text-black font-bold mb-6 flex items-center">
                <CreditCard className="w-5 h-5 mr-2 text-gray-600" />
                Fare Summary
              </h2>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Base Fare</span>
                  <span className="font-medium text-gray-800">
                    ₹ {totalPrice.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Taxes and Surcharges</span>
                  <span className="font-medium text-gray-800">
                    ₹ {totalTaxes.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Other Services</span>
                  <span className="font-medium text-gray-800">
                    ₹ {totalOtherServices.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center text-green-600">
                  <span className="font-medium">Discounts</span>
                  <span className="font-medium">
                    - ₹ {Math.abs(totalDiscounts).toLocaleString()}
                  </span>
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-black">Total Amount</span>
                    <span className="font-bold text-gray-800">
                      ₹ {grandTotal.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
              <Dialog open={open} onOpenChange={setopem}>
                <DialogTrigger asChild>
                  <Button className="w-full mt-4 bg-red-600 text-white">
                    Book Now
                  </Button>
                </DialogTrigger>
                {user ? (
                  <BookingContent />
                ) : (
                  <DialogContent className="bg-white">
                    <DialogHeader>
                      <DialogTitle>Login Required</DialogTitle>
                    </DialogHeader>
                    <p>Please log in to continue with your booking.</p>
                    <SignupDialog
                      trigger={
                        <Button className="w-full">Log In / Sign Up</Button>
                      }
                    />
                  </DialogContent>
                )}
              </Dialog>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookFlightPage;