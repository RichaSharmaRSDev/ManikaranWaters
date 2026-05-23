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

//Detailed Monthly Report
export const detailedMonthlyReport = (monthYear) => async (dispatch) => {
  dispatch({ type: "detailedMonthlyReportRequest" });

  try {
    const response = await axios.get(
      `/api/v1/report/detailedMonthly/${monthYear}`
    );
    dispatch({
      type: "detailedMonthlyReportSuccess",
      payload: response.data.report,
    });
  } catch (error) {
    dispatch({
      type: "detailedMonthlyReportFail",
      payload: error.response,
    });
  }
};

export const growthReport = (params) => async (dispatch) => {
  dispatch({ type: "growthReportRequest" });
  try {
    const response = await axios.get(`/api/v1/report/growth?${params}`);
    dispatch({ type: "growthReportSuccess", payload: response.data.data });
  } catch (error) {
    dispatch({ type: "growthReportFail", payload: error.response });
  }
};

export const clearReport = () => async (dispatch) => {
  dispatch({ type: "clearReport" });
};

export const clearErrors = () => async (dispatch) => {
  dispatch({ type: "clearErrors" });
};
