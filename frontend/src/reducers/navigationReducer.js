const initialState = {
  showNavigation: true,
};

export const navigationReducer = (state = initialState, action) => {
  switch (action.type) {
    case "toggleNavigation":
      return {
        ...state,
        showNavigation: !state.showNavigation,
      };
    default:
      return state;
  }
};
