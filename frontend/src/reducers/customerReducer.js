export const customerReducer = (state = { customers: [] }, action) => {
  switch (action.type) {
    case "AllCustomersRequest":
    case "AllCustomersIdNameRequest":
    case "AllCustomersBasicRequest":
    case "frequencyCustomerRequest":
      return {
        loading: true,
        customers: [],
      };
    case "CreateNewCustomerRequest":
      return {
        loading: true,
        customer: [],
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
        customers: action.payload.customers,
        successIdName: action.payload.success,
      };
    case "AllCustomersBasicSuccess":
      return {
        loading: false,
        customers: action.payload.customers,
        successBasic: action.payload.success,
      };
    case "frequencyCustomerSuccess":
      return {
        loading: false,
        customers: action.payload.customers,
        successfrequency: action.payload.success,
      };
    case "CreateNewCustomerSuccess":
      return {
        loading: false,
        customer: action.payload.customer,
        successCreate: action.payload.success,
      };
    case "AllCustomersFail":
    case "AllCustomersIdNameFail":
    case "AllCustomersBasicFail":
    case "CreateNewCustomerFail":
    case "frequencyCustomerFail":
      return {
        loading: false,
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
