import React, { useEffect } from "react";
import Loader from "../layout/Loader/Loader";
import { Navigate } from "react-router-dom";
import Title from "../layout/Title";
import { useSelector } from "react-redux";
import "./dashboard.scss";
import Navigation from "../Navigation/Navigation";

const Dashboard = () => {
  const { loading, isAuthenticated } = useSelector((state) => state.user);

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
          <Title title="Dashboard" />
          <Navigation />
        </div>
      )}
    </>
  );
};

export default Dashboard;
