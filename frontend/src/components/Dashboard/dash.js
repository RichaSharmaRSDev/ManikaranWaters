import React, { useEffect } from "react";
import Loader from "../layout/Loader/Loader";
import { Navigate } from "react-router-dom";
import Title from "../layout/Title";
import { useSelector } from "react-redux";
import "./dashboard.scss";

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
        </div>
      )}
    </>
  );
};

export default Dashboard;
