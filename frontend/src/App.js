import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import WebFont from "webfontloader";
import store from "./store.js";
import { loadUser } from "./actions/userAction.js";

import Header from "./components/layout/Header/Header.js";
import Footer from "./components/layout/Footer/Footer.js";
import Dashboard from "./components/Dashboard/dash.js";
import LoginSignUp from "./components/User/LoginSignUp.js";
import CreateCustomer from "./components/Customers/CreateCustomer.js";
import CreateExpense from "./components/Expenses/CreateExpense.js";
import CreateDelivery from "./components/Deliveries/CreateDelivery.js";
import AllCustomers from "./components/Customers/AllCustomers.js";
import AuthenticatedRoute from "./Routes/AuthenticatedRoute.js";
import Loader from "./components/layout/Loader/Loader.js";
import FrequencyCustomers from "./components/Customers/FrequencyCustomers.js";
import CustomersAllDetails from "./components/Customers/CustomersAllDetails.js";
import CreatePayment from "./components/Payment/CreatePayment.js";

import "./App.css";
import AllDeliveries from "./components/Deliveries/AllDeliveries.js";
import AllPayments from "./components/Payment/AllPayments.js";
import AllPredictions from "./components/Predictions/AllPredictions.js";
import AllExpenses from "./components/Expenses/AllExpenses.js";
import CreateJarsCount from "./components/Jar/CreateJarsCount.js";
import AllJarsCount from "./components/Jar/AllJarsCount.js";

function App() {
  const { loading } = useSelector((state) => state.user);

  useEffect(() => {
    store.dispatch(loadUser());
    WebFont.load({
      google: {
        families: [
          "Work Sans",
          "Poppins",
          "Comic Neue",
          "Rock Salt",
          "Tillana",
          "Cinzel",
          "Coming Soon",
        ],
      },
    });
  }, []);
  if (loading) {
    // You might want to render a loading component here
    return <Loader />;
  }

  const CustomersNestedRoutes = () => {
    return (
      <Routes>
        <Route
          path="/"
          element={
            <AuthenticatedRoute>
              <AllCustomers />
            </AuthenticatedRoute>
          }
        />
        <Route
          path="/frequency"
          element={
            <AuthenticatedRoute>
              <FrequencyCustomers />
            </AuthenticatedRoute>
          }
        />
        <Route
          path="/allDetails"
          element={
            <AuthenticatedRoute>
              <CustomersAllDetails />
            </AuthenticatedRoute>
          }
        />
      </Routes>
    );
  };

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
          path="/customer/new"
          element={
            <AuthenticatedRoute>
              <CreateCustomer />
            </AuthenticatedRoute>
          }
        />
        <Route path="/customers/*" element={<CustomersNestedRoutes />} />
        <Route
          path="/customers/frequency/:input"
          element={
            <AuthenticatedRoute>
              <FrequencyCustomers />
            </AuthenticatedRoute>
          }
        />
        <Route
          path="/delivery/new"
          element={
            <AuthenticatedRoute>
              <CreateDelivery />
            </AuthenticatedRoute>
          }
        />
        <Route
          path="/expense/new"
          element={
            <AuthenticatedRoute>
              <CreateExpense />
            </AuthenticatedRoute>
          }
        />
        <Route
          path="/expenses/:date"
          element={
            <AuthenticatedRoute>
              <AllExpenses />
            </AuthenticatedRoute>
          }
        />
        <Route
          path="/payment/new"
          element={
            <AuthenticatedRoute>
              <CreatePayment />
            </AuthenticatedRoute>
          }
        />
        <Route
          path="/deliveries/?"
          element={
            <AuthenticatedRoute>
              <AllDeliveries />
            </AuthenticatedRoute>
          }
        />
        <Route
          path="/customerspredictions/?"
          element={
            <AuthenticatedRoute>
              <AllPredictions />
            </AuthenticatedRoute>
          }
        />
        <Route
          path="/customerspredictions/*"
          element={
            <AuthenticatedRoute>
              <AllPredictions />
            </AuthenticatedRoute>
          }
        />
        <Route
          path="/payments/?"
          element={
            <AuthenticatedRoute>
              <AllPayments />
            </AuthenticatedRoute>
          }
        />
        <Route
          path="/jarInventory/*"
          element={
            <AuthenticatedRoute>
              <CreateJarsCount />
            </AuthenticatedRoute>
          }
        />
        <Route
          path="/jarInventory"
          element={
            <AuthenticatedRoute>
              <AllJarsCount />
            </AuthenticatedRoute>
          }
        />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
