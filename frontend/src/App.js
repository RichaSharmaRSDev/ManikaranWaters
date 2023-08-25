import { useEffect } from "react";
import Header from "./components/layout/Header/Header.js";
import Footer from "./components/layout/Footer/Footer.js";
import Dashboard from "./components/Dashboard/dash.js";
import LoginSignUp from "./components/User/LoginSignUp.js";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import WebFont from "webfontloader";
import NewDelivery from "./components/Deliveries/NewDelivery.js";
import CreateCustomer from "./components/Customers/CreateCustomer.js";
import Customers from "./components/Customers/Customers.js";
import AuthenticatedRoute from "./Routes/AuthenticatedRoute.js";
import { loadUser } from "./actions/userAction.js";
import store from "./store.js";
import Loader from "./components/layout/Loader/Loader.js";
import { useSelector } from "react-redux";
import "./App.css";

function App() {
  const { loading } = useSelector((state) => state.user);

  useEffect(() => {
    store.dispatch(loadUser());
    WebFont.load({
      google: {
        families: [
          "Roboto",
          "Work Sans",
          "Poppins",
          "Comic Neue",
          "Rock Salt",
          "Tillana",
          "Luxurious Roman",
        ],
      },
    });
  }, []);
  if (loading) {
    // You might want to render a loading component here
    return <Loader />;
  }
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<LoginSignUp />} />
        <Route
          path="/dashboard"
          element={
            <AuthenticatedRoute>
              <Dashboard />
            </AuthenticatedRoute>
          }
        />
        <Route
          path="/customers"
          element={
            <AuthenticatedRoute>
              <Customers />
            </AuthenticatedRoute>
          }
        />
        <Route
          path="/customer/new"
          element={
            <AuthenticatedRoute>
              <CreateCustomer />
            </AuthenticatedRoute>
          }
        />
        <Route
          path="/delivery/new"
          element={
            <AuthenticatedRoute>
              <NewDelivery />
            </AuthenticatedRoute>
          }
        />
        <Route
          path="/expense/new"
          element={
            <AuthenticatedRoute>
              <NewDelivery />
            </AuthenticatedRoute>
          }
        />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
