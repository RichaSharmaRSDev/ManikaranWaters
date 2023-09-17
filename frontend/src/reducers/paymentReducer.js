const initialState = {
  loading: false,
  payments: null,
  error: null,
  newPayment: null,
};

const paymentReducer = (state = initialState, action) => {
  switch (action.type) {
    case "createPaymentRequest":
      return {
        ...state,
        loading: true,
        error: null,
      };
    case "allPaymentRequest":
      return {
        payments: [],
        loading: true,
        error: null,
      };
    case "createPaymentSuccess":
      return {
        ...state,
        loading: false,
        newPayment: action.payload,
        error: null,
        success: true,
      };
    case "allPaymentSuccess":
      return {
        loading: false,
        payments: action.payload.payments,
        paymentCount: action.payload.paymentCount,
        paymentTotal: action.payload.paymentTotal,
        error: null,
      };
    case "createPaymentFail":
      return {
        ...state,
        loading: false,
        newPayment: null,
        error: action.payload,
      };
    case "allPaymentFail":
      console.log(action.payload);
      return {
        ...state,
        loading: false,
        payment: null,
        paymentCount: null,
        error: action.payload,
      };
    case "clearNewPayment":
      return {
        ...state,
        loading: false,
        newPayment: null,
        error: null,
        success: true,
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

export default paymentReducer;
