import axios from "axios";

// Create Expense
export const createExpense = (expenseData) => async (dispatch) => {
  dispatch({ type: "createExpenseRequest" });

  try {
    const response = await axios.post("/api/v1/expense/new", expenseData);
    const { data } = response;

    dispatch({
      type: "createExpenseSuccess",
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: "createExpenseFailure",
      payload: error.response.data.error,
    });
  }
};

//clear New expense
export const clearNewExpense = () => async (dispatch) => {
  dispatch({ type: "clearNewExpense" });
};

//Get All Expenses By Date
export const getAllExpensesByDate =
  (expenseDate, currentPage) => async (dispatch) => {
    dispatch({ type: "allExpensesRequest" });

    try {
      const response = await axios.get(
        `/api/v1/expenses/${expenseDate}?page=${currentPage}`
      );
      const { data } = response;

      dispatch({
        type: "allExpensesSuccess",
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: "allExpensesFailure",
        payload: error.response.data.error,
      });
    }
  };
