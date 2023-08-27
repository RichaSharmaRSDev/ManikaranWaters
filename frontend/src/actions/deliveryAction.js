import axios from "axios";

// Create Delivery
export const createDelivery = (deliveryData) => async (dispatch) => {
  dispatch({ type: "createDeliveryRequest" });

  try {
    const response = await axios.post("/api/v1/delivery/new", deliveryData); // Adjust the URL to your backend API
    const { delivery, payment } = response.data;

    dispatch({
      type: "createDeliverySuccess",
      payload: { delivery, payment },
    });
  } catch (error) {
    dispatch({
      type: "createDeliveryFailure",
      payload: error.response.data.error,
    });
  }
};
