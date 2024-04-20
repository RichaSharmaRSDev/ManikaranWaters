import React, { useEffect, useState } from "react";
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

  const [modal, setModal] = useState(false);

  useEffect(() => {
    const isMonthlyReport = location.pathname.includes("monthly");
    const isDailyReport = location.pathname.includes("daily");
    if (isDailyReport) {
      dispatch(dailyReport(dateText));
    }
    if (isMonthlyReport) {
      dispatch(monthlyReport(dateText));
    }
  }, [dateText, location.pathname, dispatch]);

  const openModal = () => {
    setModal(true);
  };
  const closeModal = () => {
    setModal(false);
  };
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
                  <p>Total Cans Delivered : {report.totalCansDelivered}</p>
                  <p>Total Cans Received : {report.totalReceivedCans}</p>
                  <p>Cash Received: ₹{report.totalCashReceived}</p>
                  <p>Online Payment Received : ₹{report.totalOnlineReceived}</p>
                  <p>
                    Total Payment Received :₹
                    {report.totalCashReceived + report.totalOnlineReceived}
                  </p>
                  <p>Expenses : {report.totalExpenses}</p>
                  <p>Total Revenue : {report.totalSales}</p>
                  <p>New Connections : {report.newConnections}</p>

                  <button
                    className="common-cta common-cta-small"
                    onClick={openModal}
                  >
                    More Details
                  </button>
                </div>
                {modal && (
                  <div className="modal daily-report-modal">
                    <div className="modal-bg"></div>
                    <div className="modal-text">
                      <table>
                        <thead>
                          <tr>
                            <th>Date</th>
                            <th>Delivered</th>
                            <th>Returned</th>
                            <th>Cash</th>
                            <th>Online</th>
                            <th>Total Amount</th>
                            <th>Revenue</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Object.entries(report?.dailyIndividualReport)
                            ?.sort(([dateA], [dateB]) =>
                              dateA.localeCompare(dateB)
                            )
                            ?.map(([date, data]) => (
                              <tr key={date}>
                                <td>{date}</td>
                                <td>{data.delivered}</td>
                                <td>{data.returned}</td>
                                <td>{data.cash}</td>
                                <td>{data.online}</td>
                                <td>{data.totalAmount}</td>
                                <td>{data.revenue}</td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                      <div className="closeModal" onClick={closeModal}>
                        &#x2715;
                      </div>
                    </div>
                  </div>
                )}
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
