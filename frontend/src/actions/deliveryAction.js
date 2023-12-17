import axios from "axios";

// Create Delivery
export const createDelivery = (deliveryData) => async (dispatch) => {
  dispatch({ type: "createDeliveryRequest" });

  try {
    const response = await axios.post("/api/v1/delivery/new", deliveryData);
    const { delivery /*, payment*/ } = response.data;
    dispatch({
      type: "createDeliverySuccess",
      //payload: { delivery, payment },
      payload: delivery,
    });
  } catch (error) {
    dispatch({
      type: "createDeliveryFail",
      payload: error.response.data.error,
    });
  }
};

//Get Deliveries
export const allDeliveries = (deliveryData, page) => async (dispatch) => {
  dispatch({ type: "allDeliveryRequest" });

  try {
    const response = await axios.get(
      `/api/v1/deliveries?deliveryDate=${deliveryData}&page=${page}`
    );

    const data = response.data;

    dispatch({
      type: "allDeliverySuccess",
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: "allDeliveryFail",
      payload: error.response.data.message,
    });
  }
};
//Get Range Deliveries
export const rangeDeliveries =
  (deliveryStartData, deliveryEndDate, page) => async (dispatch) => {
    dispatch({ type: "rangeDeliveryRequest" });

    try {
      const response = await axios.get(
        `/api/v1/deliveries/range?deliveryStartDate=${deliveryStartData}&deliveryEndDate=${deliveryEndDate}&page=${page}`
      );

      const data = response.data;

      dispatch({
        type: "rangeDeliverySuccess",
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: "rangeDeliveryFail",
        payload: error.response.data.message,
      });
    }
  };

export const clearNewDelivery = () => async (dispatch) => {
  dispatch({ type: "clearNewDelivery" });
};
export const clearErrors = () => async (dispatch) => {
  dispatch({ type: "clearErrors" });
};
