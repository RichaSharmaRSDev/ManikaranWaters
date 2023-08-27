const initialState = {
  loading: false,
  delivery: null,
  payment: null,
  error: null,
};

const deliveryReducer = (state = initialState, action) => {
  switch (action.type) {
    case "createDeliveryRequest":
      return {
        ...state,
        loading: true,
        error: null,
      };
    case "createDeliverySuccess":
      return {
        ...state,
        loading: false,
        delivery: action.payload.delivery,
        payment: action.payload.payment,
        error: null,
      };
    case "createDeliveryFail":
      return {
        ...state,
        loading: false,
        delivery: null,
        payment: null,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default deliveryReducer;
