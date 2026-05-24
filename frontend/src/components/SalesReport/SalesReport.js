import { useState, useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import { useSelector, useDispatch } from "react-redux";
import Title from "../layout/Title";
import Navigation from "../Navigation/Navigation";
import Loader from "../layout/Loader/Loader";
import { todayIST } from "../../utils/istDate";
import {
  dailyReport,
  monthlyReport,
  detailedMonthlyReport,
  growthReport,
} from "../../actions/salesAction";
import {
  getCustomerDeliveriesHistory,
  clearCustomerDeliveriesHistory,
} from "../../actions/customerAction";
import MetricCard from "../layout/MetricCard";
import { IconMaximize, IconX, IconDownload, IconCurrencyRupee, IconCash, IconDeviceMobile, IconReceipt, IconUsers, IconChartBar } from "@tabler/icons-react";
import filledJar from "../../assets/filledJar.png";
import emptyJar from "../../assets/emptyJar.png";
import "./SalesReport.scss";

const FS_TITLES = {
  cans: "Cans",
  revenue: "Revenue (₹)",
  donut: "Cash vs Online",
  connections: "New Connections",
};

function formatMonth(date) {
  const m = date.getMonth() + 1;
  const y = date.getFullYear();
  return `${m.toString().padStart(2, "0")}/${y}`;
}

function formatDate(date) {
  const d = date.getDate();
  const m = date.getMonth() + 1;
  const y = date.getFullYear();
  return `${d.toString().padStart(2, "0")}/${m.toString().padStart(2, "0")}/${y}`;
}

const ReportCards = ({ report }) => (
  <div className="sr-cards">
    <MetricCard label="Cans Delivered" value={report?.totalCansDelivered} icon={<img src={filledJar} alt="" style={{ width: 14, height: 14, objectFit: "contain" }} />} />
    <MetricCard label="Cans Returned" value={report?.totalReceivedCans} icon={<img src={emptyJar} alt="" style={{ width: 14, height: 14, objectFit: "contain" }} />} />
    <MetricCard label="Cash Received" value={`₹${report?.totalCashReceived ?? 0}`} icon={<IconCash size={14} />} />
    <MetricCard label="Online Received" value={`₹${report?.totalOnlineReceived ?? 0}`} icon={<IconDeviceMobile size={14} />} />
    <MetricCard label="Total Revenue" value={`₹${report?.totalSales ?? 0}`} icon={<IconCurrencyRupee size={14} />} />
    <MetricCard label="Expenses" value={`₹${report?.totalExpenses ?? 0}`} icon={<IconReceipt size={14} />} />
    <MetricCard label="New Connections" value={report?.newConnections} icon={<IconUsers size={14} />} />
  </div>
);

const HistoryPanel = ({ customerDeliveriesHistory, customerName, monthDate, onClose }) => {
  const dateTextForMonth = monthDate ? monthDate.split("-").reverse().join("/") : "";

  const grouped = {};

  customerDeliveriesHistory?.customerHistoryDeliveries?.forEach((delivery) => {
    const date = new Date(delivery.deliveryDate);
    const monthYear = formatMonth(date);
    const formattedDate = formatDate(date);
    if (dateTextForMonth && monthYear !== dateTextForMonth) return;
    if (!grouped[monthYear]) grouped[monthYear] = {};
    if (!grouped[monthYear][formattedDate]) grouped[monthYear][formattedDate] = [];
    const data = {};
    if (delivery.returnedJars > 0) data.returnedJars = delivery.returnedJars;
    if (delivery.deliveredQuantity > 0) data.deliveredJars = delivery.deliveredQuantity;
    if (delivery.deliveryAssociateName) data.deliveryAssociateName = delivery.deliveryAssociateName;
    grouped[monthYear][formattedDate].push(data);
  });

  customerDeliveriesHistory?.customerHistoryPaymnets?.forEach((payment) => {
    const date = new Date(payment.paymentDate);
    const monthYear = formatMonth(date);
    const formattedDate = formatDate(date);
    if (dateTextForMonth && monthYear !== dateTextForMonth) return;
    if (!grouped[monthYear]) grouped[monthYear] = {};
    if (!grouped[monthYear][formattedDate]) grouped[monthYear][formattedDate] = [];
    if (payment.amount > 0) {
      grouped[monthYear][formattedDate].push({
        amountReceived: payment.amount,
        paymentMode: payment.paymentMode,
      });
    }
  });

  return (
    <div className="sr-history-panel">
      <div className="sr-history-panel__header">
        <span className="sr-history-panel__name">{customerName}</span>
        <button className="sr-history-panel__close" onClick={onClose}>
          ✕
        </button>
      </div>
      <div className="sr-history-panel__body">
        {Object.keys(grouped).length === 0 ? (
          <p className="sr-history-panel__empty">No records for this period</p>
        ) : (
          Object.keys(grouped).map((monthYear) => (
            <div key={monthYear} className="sr-history-month">
              <div className="sr-history-month__label">{monthYear}</div>
              {Object.keys(grouped[monthYear]).map((date) => (
                <div key={date} className="sr-history-date">
                  <div className="sr-history-date__label">{date}</div>
                  <div className="sr-history-date__entries">
                    {grouped[monthYear][date].map((i, idx) => (
                      <div key={idx} className="sr-history-entry">
                        {i.deliveredJars > 0 && <span>Delivered: {i.deliveredJars}</span>}
                        {i.returnedJars > 0 && <span>Returned: {i.returnedJars}</span>}
                        {i.deliveryAssociateName && <span>{i.deliveryAssociateName}</span>}
                        {i.amountReceived > 0 && (
                          <>
                            <span>₹{i.amountReceived}</span>
                            <span className="sr-history-entry__mode">{i.paymentMode}</span>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const toIndian = (n) => Number(n).toLocaleString("en-IN");

const LINE_OPTIONS = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    x: { grid: { display: false }, ticks: { font: { size: 10 } } },
    y: { border: { display: false }, ticks: { font: { size: 10 } } },
  },
};

const REVENUE_LINE_OPTIONS = {
  ...LINE_OPTIONS,
  scales: {
    x: LINE_OPTIONS.scales.x,
    y: {
      border: { display: false },
      ticks: {
        font: { size: 10 },
        callback: (val) => `₹${val >= 1000 ? Math.round(val / 1000) + "k" : val}`,
      },
    },
  },
};

const CANS_LINE_OPTIONS = {
  ...LINE_OPTIONS,
  scales: {
    x: LINE_OPTIONS.scales.x,
    y: {
      border: { display: false },
      ticks: {
        font: { size: 10 },
        callback: (val) => Number(val).toLocaleString("en-IN"),
      },
    },
  },
};

const SalesReport = () => {
  const dispatch = useDispatch();
  const { report, loading, growthData } = useSelector((state) => state.sales) || {};
  const { customerDeliveriesHistory } = useSelector((state) => state.customers) || {};
  const { showNavigation } = useSelector((state) => state.navigation);

  const [activeTab, setActiveTab] = useState("daily");
  const [dailyDate, setDailyDate] = useState(todayIST());
  const [monthDate, setMonthDate] = useState(todayIST().slice(0, 7));
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);

  const [growthRange, setGrowthRange] = useState("6");
  const [growthFrom, setGrowthFrom] = useState(() => {
    const d = new Date();
    d.setMonth(d.getMonth() - 5);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  });
  const [growthTo, setGrowthTo] = useState(todayIST().slice(0, 7));

  const [fullscreenChart, setFullscreenChart] = useState(null);

  const revenueCanvasRef = useRef(null);
  const cansCanvasRef = useRef(null);
  const doughnutCanvasRef = useRef(null);
  const connectionsCanvasRef = useRef(null);
  const chartInstancesRef = useRef({});

  const fsCanvasRef = useRef(null);
  const fsChartInstanceRef = useRef(null);

  useEffect(() => {
    if (activeTab === "daily") dispatch(dailyReport(dailyDate));
    else if (activeTab === "monthly") dispatch(monthlyReport(monthDate));
    else if (activeTab === "detailed") dispatch(detailedMonthlyReport(monthDate));
  }, [activeTab, dailyDate, monthDate]);

  useEffect(() => {
    if (activeTab !== "growth") return;
    if (growthRange === "custom") {
      if (growthFrom && growthTo) dispatch(growthReport(`from=${growthFrom}&to=${growthTo}`));
    } else {
      dispatch(growthReport(`months=${growthRange}`));
    }
  }, [activeTab, growthRange, growthFrom, growthTo]);

  useEffect(() => {
    Object.values(chartInstancesRef.current).forEach((c) => { if (c) c.destroy(); });
    chartInstancesRef.current = {};

    if (activeTab !== "growth" || !growthData || !growthData.length) return;

    const labels = growthData.map((d) => d.month);
    const totalCash = growthData.reduce((s, d) => s + d.cash, 0);
    const totalOnline = growthData.reduce((s, d) => s + d.online, 0);

    if (revenueCanvasRef.current) {
      chartInstancesRef.current.revenue = new Chart(revenueCanvasRef.current, {
        type: "line",
        data: { labels, datasets: [{ data: growthData.map((d) => d.revenue), borderColor: "#0a7c4e", backgroundColor: "#0a7c4e22", fill: true, tension: 0.35, pointRadius: 3 }] },
        options: REVENUE_LINE_OPTIONS,
      });
    }
    if (cansCanvasRef.current) {
      chartInstancesRef.current.cans = new Chart(cansCanvasRef.current, {
        type: "line",
        data: {
          labels,
          datasets: [
            { label: "Delivered", data: growthData.map((d) => d.cans), borderColor: "#0163a2", backgroundColor: "#0163a222", fill: true, tension: 0.35, pointRadius: 3 },
            { label: "Returned", data: growthData.map((d) => d.returned || 0), borderColor: "#BA7517", backgroundColor: "transparent", fill: false, tension: 0.35, pointRadius: 3, borderDash: [4, 3] },
          ],
        },
        options: { ...CANS_LINE_OPTIONS, plugins: { legend: { display: true, labels: { font: { size: 10 }, usePointStyle: true, pointStyle: "line", padding: 6 } } } },
      });
    }
    if (doughnutCanvasRef.current) {
      chartInstancesRef.current.donut = new Chart(doughnutCanvasRef.current, {
        type: "doughnut",
        data: { labels: ["Cash", "Online"], datasets: [{ data: [totalCash, totalOnline], backgroundColor: ["#0a7c4ecc", "#0163a2cc"], borderWidth: 0 }] },
        options: { responsive: true, maintainAspectRatio: false, cutout: "68%", plugins: { legend: { display: false } } },
      });
    }
    if (connectionsCanvasRef.current) {
      chartInstancesRef.current.connections = new Chart(connectionsCanvasRef.current, {
        type: "line",
        data: { labels, datasets: [{ data: growthData.map((d) => d.connections), borderColor: "#BA7517", backgroundColor: "#BA751722", fill: true, tension: 0.35, pointRadius: 3 }] },
        options: LINE_OPTIONS,
      });
    }

    return () => {
      Object.values(chartInstancesRef.current).forEach((c) => { if (c) c.destroy(); });
      chartInstancesRef.current = {};
    };
  }, [activeTab, growthData]);

  useEffect(() => {
    if (fsChartInstanceRef.current) {
      fsChartInstanceRef.current.destroy();
      fsChartInstanceRef.current = null;
    }
    if (!fullscreenChart || !growthData?.length || !fsCanvasRef.current) return;

    const labels = growthData.map((d) => d.month);
    const fsCash = growthData.reduce((s, d) => s + d.cash, 0);
    const fsOnline = growthData.reduce((s, d) => s + d.online, 0);

    const FS_OPTS = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { display: false }, ticks: { font: { size: 12 } } },
        y: { border: { display: false }, ticks: { font: { size: 12 } } },
      },
    };

    if (fullscreenChart === "revenue") {
      fsChartInstanceRef.current = new Chart(fsCanvasRef.current, {
        type: "line",
        data: { labels, datasets: [{ data: growthData.map((d) => d.revenue), borderColor: "#0a7c4e", backgroundColor: "#0a7c4e22", fill: true, tension: 0.35, pointRadius: 4 }] },
        options: { ...FS_OPTS, scales: { ...FS_OPTS.scales, y: { ...FS_OPTS.scales.y, ticks: { font: { size: 12 }, callback: (v) => `₹${v >= 1000 ? Math.round(v / 1000) + "k" : v}` } } } },
      });
    } else if (fullscreenChart === "cans") {
      fsChartInstanceRef.current = new Chart(fsCanvasRef.current, {
        type: "line",
        data: {
          labels,
          datasets: [
            { label: "Delivered", data: growthData.map((d) => d.cans), borderColor: "#0163a2", backgroundColor: "#0163a222", fill: true, tension: 0.35, pointRadius: 4 },
            { label: "Returned", data: growthData.map((d) => d.returned || 0), borderColor: "#BA7517", backgroundColor: "transparent", fill: false, tension: 0.35, pointRadius: 4, borderDash: [5, 4] },
          ],
        },
        options: { ...FS_OPTS, plugins: { legend: { display: true, labels: { font: { size: 12 }, usePointStyle: true, pointStyle: "line", padding: 10 } } } },
      });
    } else if (fullscreenChart === "donut") {
      fsChartInstanceRef.current = new Chart(fsCanvasRef.current, {
        type: "doughnut",
        data: { labels: ["Cash", "Online"], datasets: [{ data: [fsCash, fsOnline], backgroundColor: ["#0a7c4ecc", "#0163a2cc"], borderWidth: 0 }] },
        options: { responsive: true, maintainAspectRatio: false, cutout: "68%", plugins: { legend: { display: false } } },
      });
    } else if (fullscreenChart === "connections") {
      fsChartInstanceRef.current = new Chart(fsCanvasRef.current, {
        type: "line",
        data: { labels, datasets: [{ data: growthData.map((d) => d.connections), borderColor: "#BA7517", backgroundColor: "#BA751722", fill: true, tension: 0.35, pointRadius: 4 }] },
        options: FS_OPTS,
      });
    }

    return () => {
      if (fsChartInstanceRef.current) {
        fsChartInstanceRef.current.destroy();
        fsChartInstanceRef.current = null;
      }
    };
  }, [fullscreenChart, growthData]);

  useEffect(() => {
    setSelectedCustomerId(null);
    dispatch(clearCustomerDeliveriesHistory());
  }, [activeTab]);

  const handleCustomerClick = (customerId) => {
    if (selectedCustomerId === customerId) {
      setSelectedCustomerId(null);
      dispatch(clearCustomerDeliveriesHistory());
      return;
    }
    setSelectedCustomerId(customerId);
    dispatch(getCustomerDeliveriesHistory(customerId));
  };

  const exportToCSV = () => {
    const fileName = `detailed_monthly_${monthDate}.csv`;
    const csvData = [
      ["ID", "Name", "Amount"],
      ...(report?.customersList?.map((i) => [i.customerId, i.name, i.remainingAmount]) || []),
    ];
    const csvString = "﻿" + csvData.map((row) => row.join(",")).join("\n");
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

  const selectedCustomerName = report?.customersList?.find(
    (c) => c.customerId === selectedCustomerId
  )?.name;

  const gn = growthData?.length || 0;
  const totalRevenue = growthData?.reduce((s, d) => s + d.revenue, 0) || 0;
  const avgRevenue = gn ? Math.round(totalRevenue / gn) : 0;
  const totalCash = growthData?.reduce((s, d) => s + d.cash, 0) || 0;
  const totalOnline = growthData?.reduce((s, d) => s + d.online, 0) || 0;
  const totalConnections = growthData?.reduce((s, d) => s + d.connections, 0) || 0;

  return (
    <>
      <Title title="Sales Report" />
      <Navigation />
      <div className={showNavigation ? "beNeutral" : "shiftLeft"}>
        <div className="sr-topbar">
          <h2 className="common-heading">Sales report</h2>
          {activeTab !== "growth" && (
            <div className="sr-datepicker">
              {activeTab === "daily" ? (
                <input
                  type="date"
                  value={dailyDate}
                  onChange={(e) => setDailyDate(e.target.value)}
                />
              ) : (
                <input
                  type="month"
                  value={monthDate}
                  onChange={(e) => setMonthDate(e.target.value)}
                />
              )}
            </div>
          )}
        </div>

        <div className="dt-tabs">
          <button
            className={`dt-tab${activeTab === "daily" ? " active" : ""}`}
            onClick={() => setActiveTab("daily")}
          >
            Daily
          </button>
          <button
            className={`dt-tab${activeTab === "monthly" ? " active" : ""}`}
            onClick={() => setActiveTab("monthly")}
          >
            Monthly
          </button>
          <button
            className={`dt-tab${activeTab === "detailed" ? " active" : ""}`}
            onClick={() => setActiveTab("detailed")}
          >
            Detailed Monthly
          </button>
          <button
            className={`dt-tab${activeTab === "growth" ? " active" : ""}`}
            onClick={() => setActiveTab("growth")}
          >
            Growth
          </button>
        </div>

        {activeTab === "growth" ? (
          <div className="sr-content">
            <div className="sr-growth-pills">
              <button
                className={`rp-period-btn${growthRange === "6" ? " active" : ""}`}
                onClick={() => setGrowthRange("6")}
              >
                Last 6 months
              </button>
              <button
                className={`rp-period-btn${growthRange === "12" ? " active" : ""}`}
                onClick={() => setGrowthRange("12")}
              >
                Last 12 months
              </button>
              <span className="rp-period-sep">|</span>
              <button
                className={`rp-period-btn${growthRange === "custom" ? " active" : ""}`}
                onClick={() => setGrowthRange("custom")}
              >
                Custom
              </button>
              {growthRange === "custom" && (
                <>
                  <div className="rp-datepicker-chip">
                    <input
                      type="month"
                      value={growthFrom}
                      onChange={(e) => setGrowthFrom(e.target.value)}
                    />
                  </div>
                  <span className="rp-to-text">to</span>
                  <div className="rp-datepicker-chip">
                    <input
                      type="month"
                      value={growthTo}
                      onChange={(e) => setGrowthTo(e.target.value)}
                    />
                  </div>
                </>
              )}
            </div>

            {loading ? (
              <Loader />
            ) : !growthData ? null : (
              <>
                <div className="sr-growth-metric-cards">
                  <MetricCard label="Total Revenue" value={`₹${toIndian(totalRevenue)}`} color="#0a7c4e" subtext={`over ${gn} months`} icon={<IconCurrencyRupee size={14} />} />
                  <MetricCard label="Avg Monthly Revenue" value={`₹${toIndian(avgRevenue)}`} color="#0163a2" subtext="per month" icon={<IconChartBar size={14} />} />
                  <MetricCard label="Total Cash Collected" value={`₹${toIndian(totalCash)}`} icon={<IconCash size={14} />} />
                  <MetricCard label="Total Online Collected" value={`₹${toIndian(totalOnline)}`} icon={<IconDeviceMobile size={14} />} />
                  <MetricCard label="New Connections" value={totalConnections} subtext={`over ${gn} months`} icon={<IconUsers size={14} />} />
                </div>

                <div className="sr-chart-section-heading">Month-wise breakdown</div>

                <div className="sr-growth-charts">
                  {[
                    { key: "cans", label: "Cans", ref: cansCanvasRef },
                    { key: "revenue", label: "Revenue (₹)", ref: revenueCanvasRef },
                    { key: "donut", label: "Cash vs Online", ref: doughnutCanvasRef },
                    { key: "connections", label: "New Connections", ref: connectionsCanvasRef },
                  ].map(({ key, label, ref }) => (
                    <div className="sr-chart-card" key={key}>
                      <div className="sr-chart-header">
                        <div className="sr-chart-label">{label}</div>
                        <button className="sr-chart-fs-btn" onClick={() => setFullscreenChart(key)}>
                          <IconMaximize size={13} />
                        </button>
                      </div>
                      <div className="sr-chart-inner">
                        <canvas ref={ref} />
                      </div>
                    </div>
                  ))}
                </div>

                <div
                  className="sr-chart-modal"
                  style={{ display: fullscreenChart ? "flex" : "none" }}
                  onClick={() => setFullscreenChart(null)}
                >
                  <div className="sr-chart-modal__inner" onClick={(e) => e.stopPropagation()}>
                    <div className="sr-chart-modal__header">
                      <span className="sr-chart-label">{FS_TITLES[fullscreenChart]}</span>
                      <button className="sr-chart-modal__close" onClick={() => setFullscreenChart(null)}>
                        <IconX size={16} />
                      </button>
                    </div>
                    {fullscreenChart === "donut" ? (
                      <div className="sr-chart-modal__donut">
                        <div className="sr-chart-modal__donut-canvas">
                          <canvas ref={fsCanvasRef} />
                        </div>
                        <div className="sr-donut-legend">
                          <div>
                            <div className="sr-donut-total">₹{toIndian(totalCash + totalOnline)}</div>
                            <div className="sr-donut-total-label">total collected</div>
                          </div>
                          <div className="sr-donut-row">
                            <span className="sr-donut-dot" style={{ background: "#0a7c4ecc" }} />
                            <span className="sr-donut-label">Cash</span>
                            <span className="sr-donut-val">₹{toIndian(totalCash)}</span>
                          </div>
                          <div className="sr-donut-row">
                            <span className="sr-donut-dot" style={{ background: "#0163a2cc" }} />
                            <span className="sr-donut-label">Online</span>
                            <span className="sr-donut-val">₹{toIndian(totalOnline)}</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="sr-chart-modal__canvas-wrap">
                        <canvas ref={fsCanvasRef} />
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        ) : loading ? (
          <Loader />
        ) : !report ? (
          <div className="noResults">
            <span>No data available for this period</span>
          </div>
        ) : (
          <div className="sr-content">
            {activeTab === "daily" && (
              <ReportCards report={report} />
            )}

            {activeTab === "monthly" && (
              <>
                <ReportCards report={report} />
                {report?.dailyIndividualReport && (
                  <div className="sr-table-wrap">
                    <table className="sr-table">
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
                        {Object.entries(report.dailyIndividualReport)
                          .sort(([a], [b]) => a.localeCompare(b))
                          .map(([date, data]) => (
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
                  </div>
                )}
              </>
            )}

            {activeTab === "detailed" && (
              <div className="sr-detailed-layout">
                <div className="sr-table-wrap">
                  <table className="sr-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th className="sr-th-right">
                          Amount{" "}
                          <button
                            className="common-cta common-cta-small"
                            onClick={exportToCSV}
                          >
                            <IconDownload size={12} />
                          </button>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {report?.customersList?.map((customer) => (
                        <tr
                          key={customer.customerId}
                          className={selectedCustomerId === customer.customerId ? "sr-row-active" : ""}
                          onClick={() => handleCustomerClick(customer.customerId)}
                        >
                          <td>{customer.customerId}</td>
                          <td>{customer.name}</td>
                          <td className="sr-td-right">{customer.remainingAmount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {selectedCustomerId && customerDeliveriesHistory?.customerHistoryDeliveries?.length > 0 && (
                  <HistoryPanel
                    customerDeliveriesHistory={customerDeliveriesHistory}
                    customerName={selectedCustomerName}
                    monthDate={monthDate}
                    onClose={() => {
                      setSelectedCustomerId(null);
                      dispatch(clearCustomerDeliveriesHistory());
                    }}
                  />
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default SalesReport;
