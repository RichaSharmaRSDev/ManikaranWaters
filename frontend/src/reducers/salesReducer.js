const initialState = {
  loading: false,
  report: [],
  growthData: null,
};

const salesReducer = (state = initialState, action) => {
  switch (action.type) {
    case "dailyReportRequest":
    case "monthlyReportRequest":
    case "detailedMonthlyReportRequest":
      return {
        ...state,
        loading: true,
        error: null,
      };
    case "dailyReportSuccess":
    case "monthlyReportSuccess":
    case "detailedMonthlyReportSuccess":
      return {
        ...state,
        loading: false,
        report: action.payload,
        error: null,
        success: true,
      };
    case "dailyReportFail":
    case "monthlyReportFail":
    case "detailedMonthlyReportFail":
      return {
        ...state,
        loading: false,
        report: null,
        error: action.payload,
      };
    case "growthReportRequest":
      return { ...state, loading: true, error: null };
    case "growthReportSuccess":
      return { ...state, loading: false, growthData: action.payload, error: null };
    case "growthReportFail":
      return { ...state, loading: false, growthData: null, error: action.payload };
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
