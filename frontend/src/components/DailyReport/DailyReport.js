import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Title from "../layout/Title";
import Loader from "../layout/Loader/Loader";
import { useLocation } from "react-router-dom";
import Navigation from "../Navigation/Navigation";
import {
  dailyReport,
  detailedMonthlyReport,
  monthlyReport,
} from "../../actions/salesAction";

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
  const [detailedMonthyTable, setDetailedMonthyTable] = useState(false);
  const [monthDetails, setMonthlyDetails] = useState(false);

  useEffect(() => {
    const isMonthlyReport = location.pathname.includes("monthly");
    const isDetailedMonthlyReport =
      location.pathname.includes("detailedMonthly");
    const isDailyReport = location.pathname.includes("daily");
    if (isDailyReport) {
      dispatch(dailyReport(dateText));
    }
    if (isDetailedMonthlyReport) {
      dispatch(detailedMonthlyReport(dateText));
      setDetailedMonthyTable(true);
    }
    if (isMonthlyReport) {
      dispatch(monthlyReport(dateText));
      setMonthlyDetails(true);
    }
  }, [dateText, location.pathname, dispatch]);

  const openModal = () => {
    setModal(true);
  };
  const closeModal = () => {
    setModal(false);
  };

  const exportToCSV = () => {
    const fileName = `detailed_monthly_sales_${location.pathname.split("/").pop()}.csv`;
    const csvData = [
      ["ID", "Name", "Amount"],
      ...report?.customersList?.map((i) => [
        i.customerId,
        i.name,
        i.remainingAmount,
      ]),
    ];
    const csvString = "\uFEFF" + csvData.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", fileName);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
                {!detailedMonthyTable && (
                  <>
                    <h2 className="common-heading">
                      Sales Details for {dateText}
                    </h2>
                    <div className="sales-report">
                      <>
                        <p>
                          Total Cans Delivered : {report.totalCansDelivered}
                        </p>
                        <p>Total Cans Received : {report.totalReceivedCans}</p>
                        <p>Cash Received: ₹{report.totalCashReceived}</p>
                        <p>
                          Online Payment Received : ₹
                          {report.totalOnlineReceived}
                        </p>
                        <p>
                          Total Payment Received :₹
                          {report.totalCashReceived +
                            report.totalOnlineReceived}
                        </p>
                        <p>Expenses : {report.totalExpenses}</p>
                        <p>Total Revenue : {report.totalSales}</p>
                        <p>New Connections : {report.newConnections}</p>

                        {monthDetails && (
                          <button
                            className="common-cta common-cta-small"
                            onClick={openModal}
                          >
                            More Details
                          </button>
                        )}
                      </>
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
                )}
                {detailedMonthyTable && (
                  <div className="daily-report-modal">
                    <div className="report-table">
                      <table>
                        <thead>
                          <tr>
                            <th>Id</th>
                            <th>Name</th>
                            <th>
                              Amount{" "}
                              <button
                                className="common-cta common-cta-small"
                                onClick={exportToCSV}
                              >
                                &#x2B07;
                              </button>
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {report?.customersList?.map((i) => (
                            <tr key={i.customerId}>
                              <td>{i.customerId}</td>
                              <td>{i.name}</td>
                              <td>{i.remainingAmount}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
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
