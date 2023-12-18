const initialState = {
  loading: false,
  report: [],
};

const salesReducer = (state = initialState, action) => {
  switch (action.type) {
    case "dailyReportRequest":
    case "monthlyReportRequest":
      return {
        ...state,
        loading: true,
        error: null,
      };
    case "dailyReportSuccess":
    case "monthlyReportSuccess":
      return {
        ...state,
        loading: false,
        report: action.payload,
        error: null,
        success: true,
      };
    case "dailyReportFail":
    case "monthlyReportSuccessFail":
      return {
        ...state,
        loading: false,
        report: null,
        error: action.payload,
      };
    case "clearErrors":
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

export default salesReducer;
