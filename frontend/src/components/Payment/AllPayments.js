import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { allPayments, clearErrors } from "../../actions/paymentAction";
import Loader from "../layout/Loader/Loader";
import { useLocation } from "react-router-dom";
import Navigation from "../Navigation/Navigation";
// import { useAlert } from "react-alert";
import Title from "../layout/Title";
import { Pagination } from "../layout/Pagination/Pagination";
import PaymentTable from "./PaymentTable";

const AllPayments = () => {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);

  const { isAuthenticated } = useSelector((state) => state.user);
  const { showNavigation } = useSelector((state) => state.navigation);
  const { payments, success, error, loading, paymentCount, paymentTotal } =
    useSelector((state) => state.payments) || {};
  const totalPages = Math.ceil(paymentCount / 20);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const paymentDateText = queryParams.get("paymentDate");

  function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  let paymentDate;

  if (paymentDateText === "today") {
    const today = new Date(Date.now());
    paymentDate = formatDate(today);
  } else if (paymentDateText === "yesterday") {
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
    paymentDate = formatDate(yesterday);
  } else {
    const customPaymentDate = new Date(paymentDateText);
    paymentDate = formatDate(customPaymentDate);
  }

  // const alert = useAlert();
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  useEffect(() => {
    dispatch(allPayments(paymentDate, currentPage));
  }, [paymentDate, currentPage]);
  useEffect(() => {
    if (success) {
      console.log("Received Payments Successfully.");
    }
    if (error) {
      console.log(error);
      dispatch(clearErrors());
    }
  }, [success, error]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <Title title={"Payment Details"} />
          <Navigation />
          <div className={showNavigation ? "beNeutral" : "shiftLeft"}>
            {payments?.length ? (
              <>
                <h2 className="common-heading">
                  Payments List for {paymentDateText}
                </h2>
                <PaymentTable payments={payments} paymentTotal={paymentTotal} />
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
                <span>No payments available for {paymentDateText}</span>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default AllPayments;
