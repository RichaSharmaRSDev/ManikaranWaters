import React, { useState, useEffect } from "react";
import Loader from "../layout/Loader/Loader";
import { Link, Navigate } from "react-router-dom";
import { logout } from "../../actions/userAction";
import { useDispatch, useSelector } from "react-redux";
import logoutSvg from "../../assets/sign-out-alt.svg";
import "./navigation.scss";
import expandCollapseLogo from "../../assets/expandCollapse.svg";
import { useAlert } from "react-alert";
import { toggleNavigation } from "../../actions/navigationAction";

const Navigation = () => {
  const dispatch = useDispatch();
  const alert = useAlert();
  let { showNavigation } = useSelector((state) => state.navigation);

  const toggleNavigationInside = () => {
    showNavigation = !showNavigation;
    dispatch(toggleNavigation(showNavigation));
  };

  const { user, loading, isAuthenticated, error } = useSelector(
    (state) => state.user
  );

  useEffect(() => {
    if (error) {
      alert.error(error);
    }
    if (isAuthenticated === false) {
      Navigate("/");
    }
  }, [isAuthenticated, alert, error]);

  function logoutUser() {
    dispatch(logout());
  }
  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="navigated-container">
          <div className="profileDetails">
            <h3>Hi {user.name}!</h3>
            <div className="logout-container" onClick={logoutUser}>
              <button>Logout</button>
              <img src={logoutSvg} alt="logout" />
            </div>
          </div>
          <nav className={`${showNavigation ? "show" : "hide"}`}>
            <button
              className="menu-toggle-button"
              onClick={toggleNavigationInside}
            >
              <img
                src={expandCollapseLogo}
                className={`${showNavigation ? "show" : "hide"}`}
                alt="toggle"
              />
            </button>

            <div className="menu">
              <button className="menu-button">Customer</button>
              <div className="submenu">
                <Link to="/customer/new">Create New Customer</Link>
                <Link to="/customers">Customer Details</Link>
                <Link to="/customers/allDetails">Customers All Details</Link>
              </div>
            </div>
            <div className="menu">
              <button className="menu-button">Customer Habits</button>
              <div className="submenu">
                <Link to="/customers/frequency/1">Daily Customers</Link>
                <Link to="/customers/frequency/2">Alternate Customers</Link>
                <Link to="/customers/frequency/3">Ternary Customers</Link>
                <Link to="/customers/frequency/:input">
                  Custom Interval Customers
                </Link>
              </div>
            </div>

            <div className="menu">
              <button className="menu-button">Entries</button>
              <div className="submenu">
                <Link to="/delivery/new">New Delivery</Link>
                <Link to="/deliveries/today">Today's Deliveries</Link>
              </div>
            </div>

            <div className="menu">
              <button className="menu-button">Payment</button>
              <div className="submenu">
                <Link to="/payment/new">Create Payment</Link>
              </div>
            </div>

            <div className="menu">
              <button className="menu-button">Expense</button>
              <div className="submenu">
                <Link to="/expenses">Expense Details</Link>
              </div>
            </div>

            <div className="menu">
              <button className="menu-button">Prediction</button>
              <div className="submenu">
                <Link to="/customers">Expected Tomorrow's Deliveries</Link>
                <Link to="/customers">Expected Today's Deliveries</Link>
              </div>
            </div>
          </nav>
        </div>
      )}
    </>
  );
};

export default Navigation;
