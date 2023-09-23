import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  clearErrors,
  getCustomersByNextDeliveryDate,
} from "../../actions/customerAction";
import Loader from "../layout/Loader/Loader";
import { Navigate, useLocation } from "react-router-dom";
import Navigation from "../Navigation/Navigation";
// import { useAlert } from "react-alert";
import HabitsCustomerTable from "../Customers/HabitsCustomerTable";
import "../Customers/Table.scss";
import Title from "../layout/Title";
import { Pagination } from "../layout/Pagination/Pagination";

const AllPredictions = () => {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);

  const { isAuthenticated } = useSelector((state) => state.user);
  const { showNavigation } = useSelector((state) => state.navigation);
  const {
    customersPredictions,
    customersPredictionsCount,
    successPrediction,
    error,
    loading,
  } = useSelector((state) => state.customers) || {};

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const nextDeliveryDateText = queryParams.get("nextDelivery");
  // const alert = useAlert();
  const totalPages = Math.ceil(customersPredictionsCount / 20);

  function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  let nextDeliveryDate;

  if (nextDeliveryDateText === "today") {
    nextDeliveryDate = new Date(Date.now());
    nextDeliveryDate = formatDate(nextDeliveryDate);
  } else if (nextDeliveryDateText === "tomorrow") {
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
    nextDeliveryDate = formatDate(tomorrow);
  } else {
    const customDeliveryDate = new Date(nextDeliveryDateText);
    nextDeliveryDate = formatDate(customDeliveryDate);
  }

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  useEffect(() => {
    dispatch(getCustomersByNextDeliveryDate(nextDeliveryDate, currentPage));
  }, [nextDeliveryDate, currentPage]);
  useEffect(() => {
    if (successPrediction) {
      console.log("Received Deliveries Successfully.");
    }
    if (error) {
      console.log(error);
      dispatch(clearErrors());
    }
  }, [successPrediction, error]);

  return (
    <>
      <Title title={"Customer Details"} />
      <Navigation />
      {loading ? (
        <Loader />
      ) : (
        <>
          <div className={showNavigation ? "beNeutral" : "shiftLeft"}>
            {customersPredictions?.length ? (
              <>
                <h2 className="common-heading">
                  Prediction for {nextDeliveryDateText}
                </h2>
                <HabitsCustomerTable customers={customersPredictions} />
                {totalPages > 1 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                )}
              </>
            ) : (
              <div className="noResults">
                <span>No deliveries prediected for {nextDeliveryDateText}</span>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default AllPredictions;
