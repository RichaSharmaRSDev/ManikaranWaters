import axios from "axios";

// Create Payment
export const createPayment = (paymentData) => async (dispatch) => {
  dispatch({ type: "createPaymentRequest" });

  try {
    const response = await axios.post("/api/v1/payment/new", paymentData);
    const { payment } = response.data;
    dispatch({
      type: "createPaymentSuccess",
      payload: payment,
    });
  } catch (error) {
    dispatch({
      type: "createPaymentFail",
      payload: error.response.data.error,
    });
  }
};

//Get Payments
export const allPayments = (paymentData, page) => async (dispatch) => {
  dispatch({ type: "allPaymentRequest" });

  try {
    const response = await axios.get(
      `/api/v1/payments?paymentDate=${paymentData}&page=${page}`
    );

    const data = response.data;
    dispatch({
      type: "allPaymentSuccess",
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: "allPaymentFail",
      payload: error.response.data.message,
    });
  }
};
export const clearNewPayment = () => async (dispatch) => {
  dispatch({ type: "clearNewPayment" });
};
export const clearErrors = () => async (dispatch) => {
  dispatch({ type: "clearErrors" });
};
