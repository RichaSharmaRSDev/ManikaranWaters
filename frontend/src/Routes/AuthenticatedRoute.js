import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import Loader from "../components/layout/Loader/Loader";

const AuthenticatedRoute = ({ children }) => {
  const { loading, isAuthenticated } = useSelector((state) => state.user);

  if (loading) {
    return <Loader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  return children;
};

export default AuthenticatedRoute;
