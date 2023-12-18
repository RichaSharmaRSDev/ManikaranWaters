import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import { customerReducer } from "./reducers/customerReducer";
import { userReducer } from "./reducers/userReducer";
import { navigationReducer } from "./reducers/navigationReducer";
import paymentReducer from "./reducers/paymentReducer";
import expenseReducer from "./reducers/expenseReducer";
import deliveryReducer from "./reducers/deliveryReducer";
import jarCountReducer from "./reducers/jarCountReducer";
import salesReducer from "./reducers/salesReducer";

const reducer = combineReducers({
  customers: customerReducer,
  payments: paymentReducer,
  user: userReducer,
  navigation: navigationReducer,
  expenses: expenseReducer,
  deliveries: deliveryReducer,
  jars: jarCountReducer,
  sales: salesReducer,
});

let initialState = {};

const middleware = [thunk];

const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
