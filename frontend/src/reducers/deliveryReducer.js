const initialState = {
  loading: false,
  delivery: null,
  payment: null,
  error: null,
  newDelivery: null,
  deliveryTotal: null,
};

const deliveryReducer = (state = initialState, action) => {
  switch (action.type) {
    case "createDeliveryRequest":
      return {
        ...state,
        loading: true,
        error: null,
      };
    case "allDeliveryRequest":
    case "rangeDeliveryRequest":
      return {
        deliveries: [],
        deliveryCount: null,
        deliveryTotal: {},
        loading: true,
        error: null,
      };
    case "createDeliverySuccess":
      return {
        ...state,
        loading: false,
        newDelivery: { ...action.payload, newDeliverySuccess: true },
        error: null,
        success: true,
      };
    case "allDeliverySuccess":
    case "rangeDeliverySuccess":
      return {
        loading: false,
        deliveries: action.payload.deliveriesWithCustomerDetails,
        deliveryCount: action.payload.deliveryCount,
        deliveryTotal: action.payload.finalDeliveryTotal,
        error: null,
        success: true,
      };
    case "createDeliveryFail":
      return {
        ...state,
        loading: false,
        newDelivery: null,
        error: action.payload,
      };
    case "allDeliveryFail":
    case "rangeDeliveryFail":
      return {
        ...state,
        loading: false,
        delivery: null,
        deliveryTotal: null,
        error: action.payload,
      };
    case "clearNewDelivery":
      return {
        ...state,
        loading: false,
        newDelivery: null,
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

export default deliveryReducer;
