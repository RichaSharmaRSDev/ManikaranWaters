import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Title from "../layout/Title";
import Navigation from "../Navigation/Navigation";
import Loader from "../layout/Loader/Loader";
import { Pagination } from "../layout/Pagination/Pagination";
import { todayIST, yesterdayIST } from "../../utils/istDate";
import {
  allDeliveries,
  rangeDeliveries,
  deleteDelivery,
} from "../../actions/deliveryAction";
import {
  allPayments,
  rangePayments,
  deletePayment,
} from "../../actions/paymentAction";
import { IconTrash, IconList, IconCurrencyRupee, IconCash, IconDeviceMobile } from "@tabler/icons-react";
import MetricCard from "../layout/MetricCard";
import filledJar from "../../assets/filledJar.png";
import emptyJar from "../../assets/emptyJar.png";
import "./Reports.scss";

const formatDate = (date) => {
  if (!date) return "";
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    timeZone: "Asia/Kolkata",
  }).format(new Date(date));
};

const Reports = () => {
  const dispatch = useDispatch();
  const { showNavigation } = useSelector((state) => state.navigation);
  const {
    deliveries,
    deliveryCount,
    deliveryTotal,
    loading: dLoading,
    deleteDeliverySuccess,
  } = useSelector((state) => state.deliveries) || {};
  const {
    payments,
    paymentCount,
    paymentTotal,
    loading: pLoading,
  } = useSelector((state) => state.payments) || {};

  const [activeTab, setActiveTab] = useState("deliveries");
  const [activePeriod, setActivePeriod] = useState("today");
  const [customDate, setCustomDate] = useState("");
  const [rangeStart, setRangeStart] = useState("");
  const [rangeEnd, setRangeEnd] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, activePeriod, customDate, rangeStart, rangeEnd]);

  // Fetch data
  useEffect(() => {
    const isRange = activePeriod === "range";
    const isCustom = activePeriod === "custom";

    if (isRange) {
      if (!rangeStart || !rangeEnd) return;
      if (activeTab === "deliveries") dispatch(rangeDeliveries(rangeStart, rangeEnd, currentPage));
      else dispatch(rangePayments(rangeStart, rangeEnd, currentPage));
    } else {
      const date =
        activePeriod === "today" ? todayIST()
        : activePeriod === "yesterday" ? yesterdayIST()
        : customDate;
      if (!date) return;
      if (activeTab === "deliveries") dispatch(allDeliveries(date, currentPage));
      else dispatch(allPayments(date, currentPage));
    }
  }, [activeTab, activePeriod, customDate, rangeStart, rangeEnd, currentPage]);

  // Re-fetch after delete
  useEffect(() => {
    if (!deleteDeliverySuccess) return;
    const isRange = activePeriod === "range";
    if (isRange && rangeStart && rangeEnd) {
      dispatch(rangeDeliveries(rangeStart, rangeEnd, currentPage));
    } else {
      const date = activePeriod === "today" ? todayIST() : activePeriod === "yesterday" ? yesterdayIST() : customDate;
      if (date) dispatch(allDeliveries(date, currentPage));
    }
  }, [deleteDeliverySuccess]);

  const loading = activeTab === "deliveries" ? dLoading : pLoading;

  const totalPages = activeTab === "deliveries"
    ? Math.ceil((deliveryCount || 0) / 20)
    : Math.ceil((paymentCount || 0) / 20);

  const handlePeriod = (period) => {
    setActivePeriod(period);
    if (period !== "custom") setCustomDate("");
    if (period !== "range") { setRangeStart(""); setRangeEnd(""); }
  };

  return (
    <>
      <Title title="Reports" />
      <Navigation />
      <div className={showNavigation ? "beNeutral" : "shiftLeft"}>

        {/* Main tabs */}
        <div className="dt-tabs">
          <button
            className={`dt-tab${activeTab === "deliveries" ? " active" : ""}`}
            onClick={() => setActiveTab("deliveries")}
          >
            Deliveries
          </button>
          <button
            className={`dt-tab${activeTab === "payments" ? " active" : ""}`}
            onClick={() => setActiveTab("payments")}
          >
            Payments
          </button>
        </div>

        {/* Period bar */}
        <div className="rp-period-bar">
          <button
            className={`rp-period-btn${activePeriod === "today" ? " active" : ""}`}
            onClick={() => handlePeriod("today")}
          >
            Today
          </button>
          <button
            className={`rp-period-btn${activePeriod === "yesterday" ? " active" : ""}`}
            onClick={() => handlePeriod("yesterday")}
          >
            Yesterday
          </button>

          <span className="rp-period-sep">|</span>

          <button
            className={`rp-period-btn${activePeriod === "custom" ? " active" : ""}`}
            onClick={() => handlePeriod("custom")}
          >
            Custom Day
          </button>
          {activePeriod === "custom" && (
            <div className="rp-datepicker-chip">
              <input
                type="date"
                value={customDate}
                onChange={(e) => setCustomDate(e.target.value)}
                autoFocus
              />
            </div>
          )}

          <span className="rp-period-sep">|</span>

          <button
            className={`rp-period-btn${activePeriod === "range" ? " active" : ""}`}
            onClick={() => handlePeriod("range")}
          >
            Date Range
          </button>
          {activePeriod === "range" && (
            <>
              <div className="rp-datepicker-chip">
                <input
                  type="date"
                  value={rangeStart}
                  onChange={(e) => setRangeStart(e.target.value)}
                  autoFocus
                />
              </div>
              <span className="rp-to-text">to</span>
              <div className="rp-datepicker-chip">
                <input
                  type="date"
                  value={rangeEnd}
                  onChange={(e) => setRangeEnd(e.target.value)}
                />
              </div>
            </>
          )}
        </div>

        {loading ? (
          <Loader />
        ) : (
          <>
            {/* Delivery content */}
            {activeTab === "deliveries" && (
              <>
                <div className="sr-cards">
                  <MetricCard label="Total Entries" value={deliveryCount ?? 0} icon={<IconList size={14} />} />
                  <MetricCard label="Cans Delivered" value={deliveryTotal?.totalDeliveredJars ?? 0} icon={<img src={filledJar} alt="" style={{ width: 14, height: 14, objectFit: "contain" }} />} />
                  <MetricCard label="Cans Returned" value={deliveryTotal?.totalReturnedJars ?? 0} icon={<img src={emptyJar} alt="" style={{ width: 14, height: 14, objectFit: "contain" }} />} />
                  <MetricCard label="Amount Collected" value={`₹${deliveryTotal?.totalAmountCollected ?? 0}`} icon={<IconCurrencyRupee size={14} />} />
                </div>

                {deliveries?.length ? (
                  <div className="sr-table-wrap">
                    <table className="sr-table">
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Customer</th>
                          <th>ID</th>
                          <th>Associate</th>
                          <th>Delivered</th>
                          <th>Returned</th>
                          <th>Amount</th>
                          <th>Mode</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {deliveries.map((d) => (
                          <tr key={d._id}>
                            <td>{formatDate(d.deliveryDate)}</td>
                            <td>{d.customerName}</td>
                            <td>{d.customerId}</td>
                            <td>{d.deliveryAssociateName}</td>
                            <td>{d.deliveredQuantity ?? 0}</td>
                            <td>{d.returnedJars ?? 0}</td>
                            <td>₹{d.amountReceived ?? 0}</td>
                            <td>{d.paymentMode || "—"}</td>
                            <td className="rp-action-cell">
                              <button
                                className="edittrip-delete"
                                onClick={() => dispatch(deleteDelivery(d._id, d.customerId))}
                                title="Delete"
                              >
                                <IconTrash size={13} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="noResults"><span>No deliveries found for this period</span></div>
                )}
              </>
            )}

            {/* Payment content */}
            {activeTab === "payments" && (
              <>
                <div className="sr-cards">
                  <MetricCard label="Total Entries" value={paymentCount ?? 0} icon={<IconList size={14} />} />
                  <MetricCard label="Cash Received" value={`₹${paymentTotal?.totalCashPayment ?? 0}`} icon={<IconCash size={14} />} />
                  <MetricCard label="Online Received" value={`₹${paymentTotal?.totalOnlinePayment ?? 0}`} icon={<IconDeviceMobile size={14} />} />
                  <MetricCard label="Total Received" value={`₹${paymentTotal?.totalPaymentReceived ?? 0}`} icon={<IconCurrencyRupee size={14} />} />
                </div>

                {payments?.length ? (
                  <div className="sr-table-wrap">
                    <table className="sr-table">
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Customer</th>
                          <th>ID</th>
                          <th>Amount</th>
                          <th>Mode</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {payments.map((p) => (
                          <tr key={p._id}>
                            <td>{formatDate(p.paymentDate)}</td>
                            <td>{p.name}</td>
                            <td>{p.customer}</td>
                            <td>₹{p.amount}</td>
                            <td>{p.paymentMode}</td>
                            <td className="rp-action-cell">
                              <button
                                className="edittrip-delete"
                                onClick={() => dispatch(deletePayment(p._id, p.customer))}
                                title="Delete"
                              >
                                <IconTrash size={13} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="noResults"><span>No payments found for this period</span></div>
                )}
              </>
            )}

            {totalPages > 1 && (
              <div style={{ marginTop: "12px" }}>
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={(p) => { setCurrentPage(p); window.scrollTo(0, 0); }}
                />
                <span style={{ fontSize: "11px", color: "#7a8fa6", paddingLeft: "12px", verticalAlign: "middle" }}>
                  Page {currentPage} of {totalPages}
                </span>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default Reports;
