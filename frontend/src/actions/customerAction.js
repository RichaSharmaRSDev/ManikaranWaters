import axios from "axios";

export const getCustomers = () => async (dispatch) => {
  try {
    dispatch({ type: "AllCustomersRequest" });
    const { data } = await axios.get(`/api/v1/customers`);
    dispatch({
      type: "AllCustomersSuccess",
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: "AllCustomersFail",
      payload: error.response.data.messsage,
    });
  }
};

export const clearErrors = () => async (dispatch) => {
  dispatch({ type: "clearErrors" });
};
