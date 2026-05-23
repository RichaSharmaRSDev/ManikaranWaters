import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import Loader from "../components/layout/Loader/Loader";

const AdminRoute = ({ children }) => {
  const { loading, isAuthenticated, user } = useSelector((state) => state.user);

  if (loading) return <Loader />;
  if (!isAuthenticated) return <Navigate to="/" />;
  if (user?.role !== "admin") return <Navigate to="/dashboard" />;

  return children;
};

export default AdminRoute;
