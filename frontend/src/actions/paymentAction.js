import axios from "axios";

// Create Payment
export const createPayment = (paymentData) => async (dispatch) => {
  dispatch({ type: "createPaymentRequest" });

  try {
    const response = await axios.post("/api/v1/payment/new", paymentData);
    const { data } = response;

    dispatch({
      type: "createPaymentSuccess",
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: "createPaymentFailure",
      payload: error.response.data.error,
    });
  }
};
