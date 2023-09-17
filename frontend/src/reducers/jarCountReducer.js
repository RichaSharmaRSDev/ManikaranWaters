const initialState = {
  loading: false,
  jars: null,
  error: null,
  jarForDay: null,
  jarForMonth: null,
};

const jarCountReducer = (state = initialState, action) => {
  switch (action.type) {
    case "createJarInventoryRequest":
      return {
        ...state,
        loading: true,
        error: null,
      };
    case "inventoryForDateRequest":
      return {
        jarForDay: [],
        loading: true,
        error: null,
        success: null,
      };
    case "inventoryForMonthRequest":
      return {
        jarForMonth: [],
        loadingMonth: true,
        errorMonth: null,
        successMonth: null,
      };
    case "updateJarInventoryRequest":
      return {
        ...state,
      };
    case "createJarInventorySuccess":
    case "updateJarInventorySuccess":
      return {
        ...state,
        loading: false,
        jarForDay: action.payload.inventoryRecord,
        error: null,
        success: true,
      };
    case "inventoryForDateSuccess":
      return {
        loading: false,
        jarForDay: action.payload.inventoryRecord,
        error: null,
        success: true,
      };
    case "inventoryForMonthSuccess":
      return {
        loadingMonth: false,
        jarForMonth: action.payload.inventoryRecords,
        highestTripCount: action.payload.highestTripCount,
        errorMonth: null,
        successMonth: true,
      };
    case "createJarInventoryFail":
    case "updateJarInventoryFail":
      return {
        ...state,
        loading: false,
        jarForDay: null,
        error: action.payload,
      };
    case "inventoryForDateFail":
      return {
        ...state,
        loading: false,
        jarForDay: null,
        error: action.payload,
        success: false,
      };
    case "inventoryForMonthFail":
      return {
        ...state,
        loadingMonth: false,
        jarForMonth: null,
        errorMonth: action.payload,
        successMonth: false,
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

export default jarCountReducer;
