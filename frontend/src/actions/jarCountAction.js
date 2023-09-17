import axios from "axios";

// Create Jar Inventory
export const createJarInventory = (jarData) => async (dispatch) => {
  dispatch({ type: "createJarInventoryRequest" });

  try {
    const response = await axios.post("/api/v1/jarInventory", jarData);
    const { data } = response;
    dispatch({
      type: "createJarInventorySuccess",
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: "createJarInventoryFail",
      payload: error.response.data.error,
    });
  }
};

// update a inventory
export const updateJarInventory = (jarData, date) => async (dispatch) => {
  dispatch({ type: "updateJarInventoryRequest" });

  try {
    const response = await axios.put(`/api/v1/jarInventory/${date}`, jarData);
    const { data } = response;
    dispatch({
      type: "updateJarInventorySuccess",
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: "updateJarInventoryFail",
      payload: error.response.data.error,
    });
  }
};

//Get inventory for day
export const InventoryForDate = (date) => async (dispatch) => {
  dispatch({ type: "inventoryForDateRequest" });

  try {
    const response = await axios.get(`/api/v1/jarInventory/${date}`);

    const data = response.data;
    dispatch({
      type: "inventoryForDateSuccess",
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: "inventoryForDateFail",
      payload: error.response.data.message,
    });
  }
};
//Get inventory for month
export const InventoryForMonth = (month) => async (dispatch) => {
  dispatch({ type: "inventoryForMonthRequest" });

  try {
    const response = await axios.get(`/api/v1/jarInventory/month/${month}`);

    const data = response.data;
    dispatch({
      type: "inventoryForMonthSuccess",
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: "inventoryForMonthFail",
      payload: error.response.data.message,
    });
  }
};
