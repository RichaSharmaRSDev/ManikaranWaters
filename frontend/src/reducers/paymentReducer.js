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
    case "rangePaymentRequest":
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
    case "rangePaymentSuccess":
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
    case "rangePaymentFail":
      console.log(action.payload);
      return {
        ...state,
        loading: false,
        payment: null,
        paymentCount: null,
        error: action.payload,
      };
    case "deletePaymentRequest":
      return {
        ...state,
        loading: true,
        error: null,
        deletePaymentSuccess: false,
      };
    case "deletePaymentSuccess":
      return {
        ...state,
        loading: false,
        deletePaymentSuccess: true,
        error: null,
      };
    case "deletePaymentFail":
      return {
        ...state,
        loading: false,
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
