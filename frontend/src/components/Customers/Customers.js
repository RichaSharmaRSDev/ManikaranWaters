import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  clearErrors,
  getAllCustomersBasicDetails,
} from "../../actions/customerAction";
import Loader from "../layout/Loader/Loader";
import { Navigate } from "react-router-dom";
import Navigation from "../Navigation/Navigation";
import { useAlert } from "react-alert";
import "./Customers.scss";
import CustomerTable from "./CustomerTable";
import Title from "../layout/Title";

const Customers = () => {
  const dispatch = useDispatch();
  const { customers, loading, error, successBasic } = useSelector(
    (state) => state.customers
  );
  const { isAuthenticated } = useSelector((state) => state.user);
  const { showNavigation } = useSelector((state) => state.navigation);
  const alert = useAlert();
  useEffect(() => {
    dispatch(getAllCustomersBasicDetails());
  }, []);
  useEffect(() => {
    if (successBasic) {
      alert.success("Reterived data successfully.");
    }
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    if (isAuthenticated === false) {
      Navigate("/");
    }
  }, [successBasic, error, alert, dispatch, isAuthenticated]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div>
          <Title title={"Customer Details"} />
          <Navigation />
          <div className={showNavigation ? "beNeutral" : "shiftLeft"}>
            <h2 className="common-heading">Customers List</h2>
            <CustomerTable customers={customers} />
          </div>
        </div>
      )}
    </>
  );
};

export default Customers;
