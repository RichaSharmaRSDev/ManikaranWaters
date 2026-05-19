import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  allPayments,
  clearErrors,
  rangePayments,
} from "../../actions/paymentAction";
import Loader from "../layout/Loader/Loader";
import { useLocation, useSearchParams } from "react-router-dom";
import Navigation from "../Navigation/Navigation";
import { todayIST, yesterdayIST } from "../../utils/istDate";
// import { useAlert } from "react-alert";
import Title from "../layout/Title";
import { Pagination } from "../layout/Pagination/Pagination";
import PaymentTable from "./PaymentTable";

const AllPayments = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const currentPage = parseInt(queryParams.get("page")) || 1;
  useEffect(() => {
    if (!queryParams.get("page")) {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        next.set("page", 1);
        return next;
      }, { replace: true });
    }
  }, []);

  const { isAuthenticated } = useSelector((state) => state.user);
  const { showNavigation } = useSelector((state) => state.navigation);
  const { payments, success, error, loading, paymentCount, paymentTotal } =
    useSelector((state) => state.payments) || {};
  const totalPages = Math.ceil(paymentCount / 20);

  const paymentDateText = queryParams.get("paymentDate");
  const paymentRangeStartDate = queryParams.get("paymentStartDate");
  const paymentRangeEndDate = queryParams.get("paymentEndDate");

  function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  let paymentDate;
  let paymentEndDate; // in case of range date

  if (paymentDateText === "today") {
    paymentDate = todayIST();
  } else if (paymentDateText === "yesterday") {
    paymentDate = yesterdayIST();
  } else if (paymentRangeStartDate && paymentRangeEndDate) {
    const customPaymentRangeStartDate = new Date(paymentRangeStartDate);
    const customPaymentRangeEndDate = new Date(paymentRangeEndDate);
    paymentDate = formatDate(customPaymentRangeStartDate);
    paymentEndDate = formatDate(customPaymentRangeEndDate);
  } else {
    const customPaymentDate = new Date(paymentDateText);
    paymentDate = formatDate(customPaymentDate);
  }

  // const alert = useAlert();
  const handlePageChange = (page) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("page", page);
      return next;
    });
    window.scrollTo(0, 0);
  };
  useEffect(() => {
    if (paymentDate && paymentEndDate) {
      dispatch(rangePayments(paymentDate, paymentEndDate, currentPage));
    } else {
      dispatch(allPayments(paymentDate, currentPage));
    }
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
                  Payments List for{" "}
                  {paymentDateText
                    ? paymentDateText?.charAt(0).toUpperCase() +
                      paymentDateText?.slice(1)
                    : `${
                        paymentRangeStartDate?.charAt(0).toUpperCase() +
                        paymentRangeStartDate?.slice(1)
                      } and ${
                        paymentRangeEndDate?.charAt(0).toUpperCase() +
                        paymentRangeEndDate?.slice(1)
                      } `}
                </h2>
                <PaymentTable payments={payments} paymentTotal={paymentTotal} />
                {totalPages > 1 && (
                  <>
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                    />
                    <span style={{ fontSize: "12px", color: "#7a8fa6" }}>
                      Page {currentPage} of {totalPages}
                    </span>
                  </>
                )}
              </>
            ) : (
              <div className="noResults">
                <span>
                  No payments available for{" "}
                  {paymentDateText
                    ? paymentDateText?.charAt(0).toUpperCase() +
                      paymentDateText?.slice(1)
                    : `${
                        paymentRangeStartDate?.charAt(0).toUpperCase() +
                        paymentRangeStartDate?.slice(1)
                      } and ${
                        paymentRangeEndDate?.charAt(0).toUpperCase() +
                        paymentRangeEndDate?.slice(1)
                      } `}
                </span>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default AllPayments;
