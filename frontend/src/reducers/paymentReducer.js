const initialState = {
  loading: false,
  payment: null,
  error: null,
};

const paymentReducer = (state = initialState, action) => {
  switch (action.type) {
    case "createPaymentRequest":
      return {
        ...state,
        loading: true,
        error: null,
        payment: [],
      };
    case "createPaymentSuccess":
      return {
        ...state,
        loading: false,
        payment: action.payload.payment,
        success: true,
        error: null,
      };
    case "createPaymentFail":
      return {
        ...state,
        loading: false,
        payment: null,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default paymentReducer;
