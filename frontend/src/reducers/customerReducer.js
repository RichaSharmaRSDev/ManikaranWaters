export const customerReducer = (state = { customers: [] }, action) => {
  switch (action.type) {
    case "AllCustomersRequest":
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
    case "AllCustomersFail":
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
