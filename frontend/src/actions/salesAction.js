import axios from "axios";

// Daily Report
export const dailyReport = (date) => async (dispatch) => {
  dispatch({ type: "dailyReportRequest" });

  try {
    const response = await axios.get(`/api/v1/report/daily/${date}`);
    dispatch({
      type: "dailyReportSuccess",
      payload: response.data.report,
    });
  } catch (error) {
    dispatch({
      type: "dailyReportFail",
      payload: error.response,
    });
  }
};

//Monthly Report
export const monthlyReport = (monthYear) => async (dispatch) => {
  dispatch({ type: "monthlyReportRequest" });

  try {
    const response = await axios.get(`/api/v1/report/monthly/${monthYear}`);
    dispatch({
      type: "monthlyReportSuccess",
      payload: response.data.report,
    });
  } catch (error) {
    dispatch({
      type: "monthlyReportFail",
      payload: error.response,
    });
  }
};

export const clearReport = () => async (dispatch) => {
  dispatch({ type: "clearReport" });
};

export const clearErrors = () => async (dispatch) => {
  dispatch({ type: "clearErrors" });
};
