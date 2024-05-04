export const customerReducer = (state = { customers: [] }, action) => {
  switch (action.type) {
    case "AllCustomersRequest":
    case "AllCustomersIdNameRequest":
    case "frequencyCustomerRequest":
      return {
        loading: true,
        customers: [],
      };
    case "AllCustomersBasicRequest":
      return {
        loading: true,
        customers: [],
      };
    case "FullCustomerDetailsRequest":
      return {
        ...state,
        loading: true,
        customerFullDetail: [],
      };
    case "CustomerDeliveriesHistoryRequest":
      return {
        ...state,
        loading: true,
        customerDeliveriesHistory: [],
      };
    case "CreateNewCustomerRequest":
      return {
        loading: true,
        newCustomer: [],
      };
    case "AllCustomersPredictionsRequest":
      return {
        loading: true,
        customersPredictions: [],
        customersPredictionsCount: null,
      };
    case "AllCustomersSuccess":
      return {
        loading: false,
        customers: action.payload.customers,
        customerCount: action.payload.customerCount,
      };
    case "AllCustomersIdNameSuccess":
      return {
        loading: false,
        customersIdName: action.payload.customers,
        successIdName: action.payload.success,
      };
    case "FullCustomerDetailsSuccess":
      return {
        ...state,
        loading: false,
        customerFullDetail: action.payload.customer,
      };
    case "CustomerDeliveriesHistorySuccess":
      return {
        ...state,
        loading: false,
        customerDeliveriesHistory: action.payload,
      };
    case "AllCustomersBasicSuccess":
      return {
        loading: false,
        customers: action.payload.customers,
        customersCount: action.payload.customerCount,
        successBasic: action.payload.success,
      };
    case "AllCustomersPredictionsSuccess":
      return {
        loading: false,
        customersPredictions: action.payload.customers,
        customersPredictionsCount: action.payload.customerCount,
        successPrediction: action.payload.success,
      };
    case "frequencyCustomerSuccess":
      return {
        loading: false,
        customers: action.payload.customers,
        successfrequency: action.payload.success,
        customerFeatureCount: action.payload.customerFeatureCount,
      };
    case "CreateNewCustomerSuccess":
      return {
        loading: false,
        newCustomer: action.payload.customer,
        successCreate: action.payload.success,
      };
    case "AllCustomersFail":
    case "AllCustomersIdNameFail":
    case "AllCustomersBasicFail":
    case "frequencyCustomerFail":
    case "AllCustomersPredictionsFail":
    case "FullCustomerDetailsError":
    case "CustomerDeliveriesHistoryError":
      return {
        loading: false,
        error: action.payload,
      };
    case "CreateNewCustomerFail":
      return {
        loading: false,
        newCustomerError: action.payload,
      };

    case "clearNewCustomer":
      return {
        ...state,
        newCustomer: null,
        successCreate: null,
      };
    case "clearCustomerFullDetail":
      return {
        ...state,
        customerFullDetail: null,
      };
    case "clearCustomerDeliveriesHistory":
      return {
        ...state,
        customerDeliveriesHistory: null,
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
