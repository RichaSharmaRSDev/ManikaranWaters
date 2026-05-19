import React, { useEffect } from "react";
import Loader from "../layout/Loader/Loader";
import { Navigate, useLocation } from "react-router-dom";
import Title from "../layout/Title";
import { useSelector } from "react-redux";
import "./dashboard.scss";

const getGreeting = () => {
  const hour = parseInt(
    new Date().toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      hour: "numeric",
      hour12: false,
    }),
    10
  );
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
};

const Dashboard = () => {
  const { loading, isAuthenticated, user } = useSelector((state) => state.user);
  const location = useLocation();

  const todayIST = new Date()
    .toLocaleDateString("en-IN", {
      timeZone: "Asia/Kolkata",
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    })
    .replace(/,/g, "");

  useEffect(() => {
    if (isAuthenticated === false) {
      Navigate("/");
    }
  }, [isAuthenticated]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="dashboard-container">
          {location.pathname !== "/deliveryPanel" && (
            <div className="welcome-banner">
              <p className="welcome-banner__label">MANIKARAN WATERS · DASHBOARD</p>
              <h2 className="welcome-banner__greeting">
                {getGreeting()}, {user?.name}!
              </h2>
              <p className="welcome-banner__date">{todayIST}</p>
            </div>
          )}
          <Title title="Dashboard" />
        </div>
      )}
    </>
  );
};

export default Dashboard;
