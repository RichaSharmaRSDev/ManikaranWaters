import { useEffect } from "react";
import { useSelector } from "react-redux";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import WebFont from "webfontloader";
import store from "./store.js";
import { loadUser } from "./actions/userAction.js";

import AppLayout from "./components/layout/App/AppLayout.js";
import LoginSignUp from "./components/User/LoginSignUp.js";
import AdminCreateUser from "./components/User/AdminCreateUser.js";
import AuthenticatedRoute from "./Routes/AuthenticatedRoute.js";
import AdminRoute from "./Routes/AdminRoute.js";
import Loader from "./components/layout/Loader/Loader.js";

import Dashboard from "./components/Dashboard/dash.js";
import CreateCustomer from "./components/Customers/CreateCustomer.js";
import AllCustomers from "./components/Customers/AllCustomers.js";
import FrequencyCustomers from "./components/Customers/FrequencyCustomers.js";
import QuickAccess from "./components/Customers/QuickAccess.js";

import CreateDelivery from "./components/Deliveries/CreateDelivery.js";
import CreatePayment from "./components/Payment/CreatePayment.js";
import Reports from "./components/Reports/Reports.js";

import CreateExpense from "./components/Expenses/CreateExpense.js";
import AllExpenses from "./components/Expenses/AllExpenses.js";

import AllPredictions from "./components/Predictions/AllPredictions.js";
import CreateJarsCount from "./components/Jar/CreateJarsCount.js";
import AllJarsCount from "./components/Jar/AllJarsCount.js";

import SalesReport from "./components/SalesReport/SalesReport.js";
import DeliveryPanel from "./components/DeliveryPanel/DeliveryPanel.js";
import DeliveryTrips from "./components/DeliveryTrips/DeliveryTrips.js";

import "./App.css";

// Wraps a page in AuthenticatedRoute + AppLayout (sidebar + header)
const AuthPage = ({ children }) => (
  <AuthenticatedRoute>
    <AppLayout>{children}</AppLayout>
  </AuthenticatedRoute>
);

// Wraps a page in AdminRoute + AppLayout (admin-only)
const AdminPage = ({ children }) => (
  <AdminRoute>
    <AppLayout>{children}</AppLayout>
  </AdminRoute>
);


function App() {
  const { loading } = useSelector((state) => state.user);

  useEffect(() => {
    store.dispatch(loadUser());
    WebFont.load({
      google: {
        families: ["Work Sans", "Poppins", "Comic Neue", "Tillana", "Cinzel"],
      },
    });
  }, []);

  if (loading) return <Loader />;

  const CustomersNestedRoutes = () => (
    <Routes>
      <Route path="/" element={<AuthPage><AllCustomers /></AuthPage>} />
      <Route path="/frequency" element={<AuthPage><FrequencyCustomers /></AuthPage>} />
    </Routes>
  );

  return (
    <Router>
      <Routes>
        {/* Public */}
        <Route path="/" element={<LoginSignUp />} />

        {/* Dashboard */}
        <Route path="/dashboard" element={<AuthPage><Dashboard /></AuthPage>} />

        {/* Customers */}
        <Route path="/customers/*" element={<CustomersNestedRoutes />} />
        <Route path="/customer/new" element={<AuthPage><CreateCustomer /></AuthPage>} />
        <Route path="/customers/frequency" element={<AuthPage><FrequencyCustomers /></AuthPage>} />
        <Route path="/quickaccess" element={<AuthPage><QuickAccess /></AuthPage>} />

        {/* Deliveries & Payments */}
        <Route path="/delivery/new" element={<AuthPage><CreateDelivery /></AuthPage>} />
        <Route path="/payment/new" element={<AuthPage><CreatePayment /></AuthPage>} />
        <Route path="/reports" element={<AuthPage><Reports /></AuthPage>} />

        {/* Expenses */}
        <Route path="/expense/new" element={<AuthPage><CreateExpense /></AuthPage>} />
        <Route path="/expenses" element={<AuthPage><AllExpenses /></AuthPage>} />

        {/* Predictions */}
        <Route path="/customerspredictions" element={<AuthPage><AllPredictions /></AuthPage>} />

        {/* Jar count */}
        <Route path="/jarInventory" element={<AuthPage><AllJarsCount /></AuthPage>} />
        <Route path="/jarInventory/*" element={<AuthPage><CreateJarsCount /></AuthPage>} />

        {/* Reports — admin only */}
        <Route path="/report/sales" element={<AdminPage><SalesReport /></AdminPage>} />

        {/* Delivery trips */}
        <Route path="/deliverytrips" element={<AuthPage><DeliveryTrips /></AuthPage>} />

        {/* Admin */}
        <Route path="/admin/create-user" element={<AdminPage><AdminCreateUser /></AdminPage>} />

        {/* Delivery Panel */}
        <Route path="/deliveryPanel" element={<AuthPage><DeliveryPanel /></AuthPage>} />
      </Routes>
    </Router>
  );
}

export default App;