export const toggleNavigation = () => async (dispatch) => {
  try {
    dispatch({ type: "toggleNavigation" });
  } catch (error) {
    console.log("toggle state not saved");
  }
};
