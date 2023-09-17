const initialState = {
  loading: false,
  newExpense: null,
  error: null,
  expenses: null,
  expenseCount: null,
  expenseTotal: null,
};

const expenseReducer = (state = initialState, action) => {
  switch (action.type) {
    case "createExpenseRequest":
      return {
        ...state,
        loading: true,
        error: null,
        newExpense: [],
      };
    case "createExpenseSuccess":
      return {
        ...state,
        loading: false,
        newExpense: action.payload.newExpense,
        newExpenseSuccess: true,
        error: null,
      };
    case "createExpenseFail":
      return {
        ...state,
        loading: false,
        newExpense: null,
        newExpenseError: action.payload,
      };
    case "clearNewExpense":
      return {
        ...state,
        loading: false,
        newExpense: null,
        newExpenseError: null,
      };
    case "allExpensesRequest":
      return {
        ...state,
        loading: true,
        error: null,
        expenses: [],
      };
    case "allExpensesSuccess":
      return {
        ...state,
        loading: false,
        expenses: action.payload.expenses,
        expenseCount: action.payload.expenseCount,
        expenseTotal: action.payload.totalAmount,
        success: true,
        error: null,
      };
    case "allExpensesFail":
      return {
        ...state,
        loading: false,
        expenses: null,
        expenseCount: null,
        expenseTotal: null,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default expenseReducer;
