import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import { customerReducer } from "./reducers/customerReducer";
import { userReducer } from "./reducers/userReducer";
import { navigationReducer } from "./reducers/navigationReducer";

const reducer = combineReducers({
  customers: customerReducer,
  user: userReducer,
  navigation: navigationReducer,
});

let initialState = {};

const middleware = [thunk];

const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
