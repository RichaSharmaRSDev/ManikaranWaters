import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Title from "../layout/Title";
import Loader from "../layout/Loader/Loader";
import { useLocation } from "react-router-dom";
import Navigation from "../Navigation/Navigation";
import { dailyReport, monthlyReport } from "../../actions/salesAction";

const DailyReport = () => {
  const dispatch = useDispatch();
  const { report, success, error, loading } =
    useSelector((state) => state.sales) || {};
  const { isAuthenticated } = useSelector((state) => state.user);
  const { showNavigation } = useSelector((state) => state.navigation);

  const location = useLocation();
  const segments = location.pathname.split("/");
  const dateText = segments[segments.length - 1];

  useEffect(() => {
    const isMonthlyReport = location.pathname.includes("monthly");
    const isDailyReport = location.pathname.includes("daily");
    if (isDailyReport) {
      dispatch(dailyReport(dateText));
    }
    if (isMonthlyReport) {
      dispatch(monthlyReport(dateText));
    }
  }, [dateText, location.pathname]);
  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <Title title={"Sales Details"} />
          <Navigation />
          <div className={showNavigation ? "beNeutral" : "shiftLeft"}>
            {report ? (
              <>
                <h2 className="common-heading">Sales Details for {dateText}</h2>
                <div className="sales-report">
                  <p>Report Date : {dateText}</p>
                  <p>Total Cans Delivered : {report.totalCansDelivered}</p>
                  <p>Total Cans Received : {report.totalReceivedCans}</p>
                  <p>Cash Received: {report.totalCashReceived}</p>
                  <p>
                    Total Online Payment Received : {report.totalOnlineReceived}
                  </p>
                  <p>Expenses : {report.totalExpenses}</p>
                  <p>Total Revenue : {report.totalSales}</p>
                </div>
              </>
            ) : (
              <div className="noResults">
                <span>No details available for {dateText}</span>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default DailyReport;
