import axios from "axios";

// All Trips
export const getAllTrips = () => async (dispatch) => {
  dispatch({ type: "allTripsRequest" });
  try {
    const response = await axios.get(`/api/v1/trips`);

    dispatch({
      type: "allTripsSuccess",
      payload: response.data,
    });
  } catch (error) {
    console.log(error);
  }
};

// Trips By Date
export const getTripsByDate = (date) => async (dispatch) => {
  dispatch({ type: "tripsByDateRequest" });
  try {
    const response = await axios.get(`/api/v1/trips/${date}`);
    dispatch({
      type: "tripsByDateSuccess",
      payload: response.data,
    });
  } catch (error) {
    console.log(error);
  }
};

// Trips By Date and Delivery Guy
export const getTripsByDateAndDeliveryGuy =
  (date, deliveryGuyName) => async (dispatch) => {
    dispatch({ type: "tripsByDateAndDeliveryGuyRequest" });
    try {
      const response = await axios.get(
        `/api/v1/trips/${date}/${deliveryGuyName}`
      );
      dispatch({
        type: "tripsByDateAndDeliveryGuySuccess",
        payload: response.data,
      });
    } catch (error) {
      console.log(error);
    }
  };

// get Delivery guyNames
export const getAllDeliveryGuyName = () => async (dispatch) => {
  dispatch({ type: "allDeliveryGuyNamesRequest" });
  try {
    const response = await axios.get(`/api/v1/deliveryGuyNames`);

    dispatch({
      type: "allDeliveryGuyNamesSuccess",
      payload: response.data.deliveryGuys,
    });
  } catch (error) {
    console.log(error);
  }
};

export const clearTripData = () => async (dispatch) => {
  dispatch({ type: "clearTripData" });
};

export const clearErrors = () => async (dispatch) => {
  dispatch({ type: "clearErrors" });
};
