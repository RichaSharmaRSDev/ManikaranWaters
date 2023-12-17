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

export const getAllCustomersBasicDetails = (page) => async (dispatch) => {
  try {
    dispatch({ type: "AllCustomersBasicRequest" });
    const { data } = await axios.get(`/api/v1/customersbasic?page=${page}`);
    dispatch({
      type: "AllCustomersBasicSuccess",
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: "AllCustomersBasicFail",
      payload: error.response.data.messsage,
    });
  }
};
export const getCustomersIdName = () => async (dispatch) => {
  try {
    dispatch({ type: "AllCustomersIdNameRequest" });
    const { data } = await axios.get(`/api/v1/customersidname`);
    dispatch({
      type: "AllCustomersIdNameSuccess",
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: "AllCustomersIdNameFail",
      payload: error.response.data.messsage,
    });
  }
};

export const getFullCustomerDetails = (id) => async (dispatch) => {
  try {
    dispatch({ type: "FullCustomerDetailsRequest" });
    const { data } = await axios.get(`/api/v1/customer/${id}`);
    console.log({ data });
    dispatch({
      type: "FullCustomerDetailsSuccess",
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: "FullCustomerDetailsError",
      payload: error.response.data.messsage,
    });
  }
};

export const getCustomersByNextDeliveryDate =
  (date, page) => async (dispatch) => {
    try {
      dispatch({ type: "AllCustomersPredictionsRequest" });
      const { data } = await axios.get(
        `/api/v1/customerspredictions?date=${date}&page=${page}`
      );
      dispatch({
        type: "AllCustomersPredictionsSuccess",
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: "AllCustomersPredictionsFail",
        payload: error.response.data.messsage,
      });
    }
  };
export const createNewCustomer = (formData) => async (dispatch) => {
  try {
    dispatch({ type: "CreateNewCustomerRequest" });
    const { data } = await axios.post("/api/v1/customer/new", formData); // Add request data if needed
    dispatch({
      type: "CreateNewCustomerSuccess",
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: "CreateNewCustomerFail",
      payload: error.response.data.message,
    });
  }
};

export const clearNewCustomer = () => async (dispatch) => {
  dispatch({ type: "clearNewCustomer" });
};
export const clearCustomerFullDetail = () => async (dispatch) => {
  dispatch({ type: "clearCustomerFullDetail" });
};

export const frequencyCustomers = (days, page) => async (dispatch) => {
  try {
    dispatch({ type: "frequencyCustomerRequest" });
    const { data } = await axios.get(
      `/api/v1/customersbasic?frequency=${days}&page=${page}`
    );
    dispatch({
      type: "frequencyCustomerSuccess",
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: "frequencyCustomerFail",
      payload: error.response.data.message,
    });
  }
};

export const clearErrors = () => async (dispatch) => {
  dispatch({ type: "clearErrors" });
};
