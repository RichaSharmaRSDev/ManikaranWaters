import axios from "axios";

export const getPredictions = (date, page) => async (dispatch) => {
  try {
    dispatch({ type: "AllPredictionsRequest" });
    const { data } = await axios.get(`/api/v1/customersbasic?page=${page}`);
    dispatch({
      type: "AllPredictionsSuccess",
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: "AllPredictionsFail",
      payload: error.response.data.messsage,
    });
  }
};
