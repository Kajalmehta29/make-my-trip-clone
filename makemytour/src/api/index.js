import axios from "axios";

const BACKEND_URL = "http://localhost:8081";

export const login = async (email, password) => {
  try {
    const url = `${BACKEND_URL}/user/login?email=${email}&password=${password}`;
    const res = await axios.post(url);
    const data = res.data;
    return data;
  } catch (error) {
    throw error;
  }
};

export const signup = async (
  firstName,
  lastName,
  email,
  phoneNumber,
  password
) => {
  try {
    const res = await axios.post(`${BACKEND_URL}/user/signup`, {
      firstName,
      lastName,
      email,
      phoneNumber,
      password,
    });
    const data = res.data;
    return data;
  } catch (error) {
    throw error;
  }
};

export const getuserbyemail = async (email) => {
  try {
    const res = await axios.get(`${BACKEND_URL}/user/email?email=${email}`);
    const data = res.data;
    return data;
  } catch (error) {
    throw error;
  }
};

export const editprofile = async (
  id,
  firstName,
  lastName,
  email,
  phoneNumber
) => {
  try {
    const res = await axios.post(`${BACKEND_URL}/user/edit?id=${id}`, {
      firstName,
      lastName,
      email,
      phoneNumber,
    });
    const data = res.data;
    return data;
  } catch (error) {
    console.error(error);
  }
};
export const getflight = async () => {
  try {
    const res = await axios.get(`${BACKEND_URL}/flight`);
    const data = res.data;
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const addflight = async (
  flightName,
  from,
  to,
  departureTime,
  arrivalTime,
  price,
  availableSeats
) => {
  try {
    const res = await axios.post(`${BACKEND_URL}/admin/flight`, {
      flightName,
      from,
      to,
      departureTime,
      arrivalTime,
      price,
      availableSeats,
    });
    const data = res.data;
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const editflight = async (
  id,
  flightName,
  from,
  to,
  departureTime,
  arrivalTime,
  price,
  availableSeats
) => {
  try {
    const res = await axios.put(`${BACKEND_URL}/admin/flight/${id}`, {
      flightName,
      from,
      to,
      departureTime,
      arrivalTime,
      price,
      availableSeats,
    });
    const data = res.data;
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const gethotel = async () => {
  try {
    const res = await axios.get(`${BACKEND_URL}/hotel`);
    const data = res.data;
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const addhotel = async (
  hotelName,
  location,
  pricePerNight,
  availableRooms,
  amenities
) => {
  try {
    const res = await axios.post(`${BACKEND_URL}/admin/hotel`, {
      hotelName,
      location,
      pricePerNight,
      availableRooms,
      amenities,
    });
    const data = res.data;
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const edithotel = async (
  id,
  hotelName,
  location,
  pricePerNight,
  availableRooms,
  amenities
) => {
  try {
    const res = await axios.put(`${BACKEND_URL}/admin/hotel/${id}`, {
      hotelName,
      location,
      pricePerNight,
      availableRooms,
      amenities,
    });
    const data = res.data;
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const handleflightbooking = async (userId, flightId, seats, price) => {
  try {
    const url = `${BACKEND_URL}/booking/flight?userId=${userId}&flightId=${flightId}&seats=${seats}&price=${price}`;
    const res = await axios.post(url);
    const data = res.data;
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const handlehotelbooking = async (
  userId,
  hotelId,
  rooms,
  price,
  checkInDate
) => {
  try {
    const url = `${BACKEND_URL}/booking/hotel?userId=${userId}&hotelId=${hotelId}&rooms=${rooms}&price=${price}&checkInDate=${checkInDate}`;
    const res = await axios.post(url);
    const data = res.data;
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const cancelBooking = async (userId, bookingId, cancellationReason) => {
  try {
    const res = await axios.post(
      `${BACKEND_URL}/booking/cancel?userId=${userId}&bookingId=${bookingId}&cancellationReason=${cancellationReason}`
    );
    return res.data;
  } catch (error) {
    throw error;
  }
};
export const addFlightReview = async (flightId, review) => {
  try {
    const res = await axios.post(
      `${BACKEND_URL}/review/flight/${flightId}`,
      review
    );
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const addHotelReview = async (hotelId, review) => {
  try {
    const res = await axios.post(
      `${BACKEND_URL}/review/hotel/${hotelId}`,
      review
    );
    return res.data;
  } catch (error) {
    throw error;
  }
};
export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  try {
    const res = await axios.post(`${BACKEND_URL}/admin/upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const addReply = async (productId, reviewId, type, reply) => {
  try {
    const res = await axios.post(
      `${BACKEND_URL}/review/${productId}/${reviewId}/reply?type=${type}`,
      reply
    );
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const flagReview = async (productId, reviewId, type) => {
  try {
    const res = await axios.post(`${BACKEND_URL}/admin/review/flag`, {
      productId,
      reviewId,
      type,
    });
    return res.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Marks a review as helpful.
 * This is the new function.
 */
export const markHelpful = async (productId, reviewId, type, userId) => {
  try {
    const res = await axios.post(
      `${BACKEND_URL}/review/${productId}/${reviewId}/helpful?type=${type}`,
      { userId } // Send userId in the request body
    );
    return res.data;
  } catch (error) {
    throw error;
  }
};
export const getFlightStatus = async (flightNumber) => {
  try {
    const res = await axios.get(`${BACKEND_URL}/flight-status/${flightNumber}`);
    return res.data;
  } catch (error) {
    throw error;
  }
};


