const initialState = {
  loading: false,
  allTrips: [],
  deliveryGuyNames: [],
  tripsByDateLoading: true,
  tripsByDateAndDeliveryGuyLoading: true,
};

const tripsReducer = (state = initialState, action) => {
  switch (action.type) {
    case "allTripsRequest":
    case "tripsByDateRequest":
    case "tripsByDateAndDeliveryGuyRequest":
      return {
        ...state,
      };

    case "allTripsSuccess":
      return {
        ...state,
        loading: false,
        allTrips: action.payload.trips,
        error: null,
        success: true,
      };

    case "tripsByDateSuccess":
      return {
        ...state,
        tripsByDateLoading: false,
        tripsByDate: action.payload.tripsByDate,
        tripsByDateError: null,
        tripsByDateSuccess: true,
      };

    case "tripsByDateAndDeliveryGuySuccess":
      return {
        ...state,
        tripsByDateAndDeliveryGuyLoading: false,
        tripsByDateAndDeliveryGuy: action.payload.tripsByDateAndDeliveryGuy,
        tripsByDateAndDeliveryGuyError: null,
        tripsByDateAndDeliveryGuySuccess: true,
      };

    case "clearTripData":
      return {
        ...initialState,
      };
    case "clearErrors":
      return {
        ...state,
        error: null,
      };
    case "allDeliveryGuyNamesRequest":
      return {
        ...state,
        loading: true,
        error: null,
      };
    case "allDeliveryGuyNamesSuccess":
      return {
        ...state,
        loading: false,
        error: null,
        deliveryGuyNames: action.payload,
      };
    default:
      return state;
  }
};

export default tripsReducer;
