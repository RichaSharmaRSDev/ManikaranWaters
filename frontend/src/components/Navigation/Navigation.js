import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Loader from "../layout/Loader/Loader";
import { Link, Navigate, useNavigate, useLocation } from "react-router-dom";
import { logout } from "../../actions/userAction";
import { useDispatch, useSelector } from "react-redux";
import Logo from "../../assets/manikaran_waters_logo.png";
import "./navigation.scss";
// import { useAlert } from "react-alert";
import { toggleNavigation } from "../../actions/navigationAction";
import {
  IconUsers,
  IconRepeat,
  IconPencil,
  IconReportAnalytics,
  IconReceipt,
  IconTrendingUp,
  IconHexagon,
  IconTruckDelivery,
  IconChartBar,
  IconMapPin,
  IconUserPlus,
  IconLayoutSidebarLeftCollapse,
  IconLayoutSidebarLeftExpand,
  IconChevronUp,
  IconChevronDown,
} from "@tabler/icons-react";

const Navigation = () => {
  const dispatch = useDispatch();
  // const alert = useAlert();
  const navigate = useNavigate();
  let { showNavigation } = useSelector((state) => state.navigation);
  const [paymentModal, setPaymentModal] = useState(false);
  const [paymentRangeModal, setPaymentRangeModal] = useState(false);
  const [deliveryModal, setDeliveryModal] = useState(false);
  const [deliveryRangeModal, setDeliveryRangeModal] = useState(false);
  const [expenseModal, setExpenseModal] = useState(false);
  const [predictionModal, setPredictionModal] = useState(false);
  const [salesDailyModal, setSalesDailyModal] = useState(false);
  const [salesMonthlyModal, setSalesMonthlyModal] = useState(false);
  const [salesDetailedMonthlyModal, setSalesDetailedMonthlyModal] =
    useState(false);
  const [customerFrequencyModal, setCustomerFrequencyModal] = useState("");
  const [customPaymentDate, setCustomPaymentDate] = useState("");
  const [customPaymentDateRangeStart, setCustomPaymentDateRangeStart] =
    useState("");
  const [customPaymentDateRangeEnd, setCustomPaymentDateRangeEnd] =
    useState("");
  const [customDeliveryDate, setCustomDeliveryDate] = useState("");
  const [customDeliveryDateRangeStart, setCustomDeliveryDateRangeStart] =
    useState("");
  const [customDeliveryDateRangeEnd, setCustomDeliveryDateRangeEnd] =
    useState("");
  const [customFrequencyNumber, setCustomFrequencyNumber] = useState("");
  const [customExpenseDate, setCustomExpenseDate] = useState("");
  const [customPredictionDate, setCustomPredictionDate] = useState("");
  const [salesDailyDate, setSalesDailyDate] = useState("");
  const [salesMonthlyDate, setSalesMonthlyDate] = useState("");
  const [salesDetailedMonthlyDate, setSalesDetailedMonthlyDate] = useState("");

  const handlePaymentModalSubmit = () => {
    setPaymentModal(false);
    navigate(`/payments?paymentDate=${customPaymentDate}`);
    setCustomPaymentDate("");
  };

  const handlePaymentRangeModalSubmit = () => {
    setPaymentRangeModal(false);
    navigate(
      `/payments/range?paymentStartDate=${customPaymentDateRangeStart}&paymentEndDate=${customPaymentDateRangeEnd}`
    );
    setCustomPaymentDateRangeStart("");
    setCustomPaymentDateRangeEnd("");
  };

  const handleDeliveryModalSubmit = () => {
    setDeliveryModal(false);
    navigate(`/deliveries?deliveryDate=${customDeliveryDate}`);
    setCustomDeliveryDate("");
  };

  const handleDeliveryRangeModalSubmit = () => {
    setDeliveryRangeModal(false);
    navigate(
      `/deliveries/range?deliveryStartDate=${customDeliveryDateRangeStart}&deliveryEndDate=${customDeliveryDateRangeEnd}`
    );
    setCustomDeliveryDateRangeStart("");
    setCustomDeliveryDateRangeEnd("");
  };

  const handleCustomerFrequencyModalSubmit = () => {
    setCustomerFrequencyModal(false);
    navigate(`/customers/frequency/${customFrequencyNumber}`);
    setCustomerFrequencyModal("");
  };

  const handleExpenseModalSubmit = () => {
    setExpenseModal(false);
    navigate(`/expenses/${customExpenseDate}`);
    setCustomExpenseDate("");
  };

  const handlePredictionModalSubmit = () => {
    setPredictionModal(false);
    navigate(`/customerspredictions?nextDelivery=${customPredictionDate}`);
    setCustomPredictionDate("");
  };

  const handleSalesDailyModalSubmit = () => {
    setSalesDailyModal(false);
    navigate(`/report/daily/${salesDailyDate}`);
    setSalesDailyDate("");
  };
  const handleSalesMonthlyModalSubmit = () => {
    setSalesDailyModal(false);
    navigate(`/report/monthly/${salesMonthlyDate}`);
    setSalesDailyDate("");
  };
  const handleSalesDetailedMonthlyModalSubmit = () => {
    setSalesDailyModal(false);
    navigate(`/report/detailedMonthly/${salesDetailedMonthlyDate}`);
    setSalesDailyDate("");
  };

  const location = useLocation();

  const getInitialMenu = (pathname) => {
    if (pathname === "/customers" || pathname.startsWith("/customer/") || pathname === "/quickaccess") return "customer";
    if (pathname.startsWith("/customers/frequency")) return "habits";
    if (pathname === "/delivery/new" || pathname === "/payment/new") return "entries";
    if (pathname.startsWith("/deliveries") || pathname.startsWith("/payments")) return "reports";
    if (pathname.startsWith("/expense")) return "expense";
    if (pathname.startsWith("/customerspredictions")) return "prediction";
    if (pathname.startsWith("/jarInventory")) return "jarcount";
    if (["/trips", "/makeDeliveryList", "/arrangetrips"].includes(pathname)) return "trips";
    if (pathname.startsWith("/report")) return "sales";
    if (pathname === "/deliveryPanel") return "delivery-panel";
    return null;
  };

  const [openMenu, setOpenMenu] = useState(() => getInitialMenu(location.pathname));

  const toggleMenu = (key) =>
    setOpenMenu((prev) => (prev === key ? null : key));

  const isActive = (to) => {
    const [path, qs] = to.split("?");
    if (!qs)
      return (
        location.pathname === path ||
        location.pathname.startsWith(path + "/")
      );
    return location.pathname === path && location.search === "?" + qs;
  };

  const toggleNavigationInside = () => {
    showNavigation = !showNavigation;
    dispatch(toggleNavigation(showNavigation));
  };

  const { user, loading, isAuthenticated, error } = useSelector(
    (state) => state.user
  );

  useEffect(() => {
    if (error) {
      console.log(error);
    }
    if (isAuthenticated === false) {
      Navigate("/");
    }
  }, [isAuthenticated, alert, error]);

  function logoutUser() {
    dispatch(logout());
  }

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="navigated-container">
          <nav className={`${showNavigation ? "show" : "hide"}`}>
            <Link to="/dashboard" className="nav-brand">
              <img src={Logo} alt="Manikaran Waters" className="nav-logo" />
              <span className="nav-brand-title">MANIKARAN WATERS</span>
            </Link>
            <button
              className="menu-toggle-button"
              onClick={toggleNavigationInside}
              title={showNavigation ? "Collapse sidebar" : "Expand sidebar"}
            >
              {showNavigation
                ? <IconLayoutSidebarLeftCollapse size={22} />
                : <IconLayoutSidebarLeftExpand size={22} />
              }
            </button>

            {(user.role === "admin" || user.role === "user") && (
              <>
                <div className="nav-section-label">Customers</div>
                <div className="menu">
                  <button className="menu-button" onClick={() => toggleMenu("customer")}>
                    <IconUsers size={18} />
                    <span>Customer</span>
                    <span className="menu-chevron">
                      {openMenu === "customer" ? <IconChevronUp size={16} /> : <IconChevronDown size={16} />}
                    </span>
                  </button>
                  <div className={`submenu${openMenu === "customer" ? " open" : ""}`}>
                    <Link to="/customer/new" className={isActive("/customer/new") ? "active" : ""}>Create New Customer</Link>
                    <Link to="/customers" className={isActive("/customers") ? "active" : ""}>Customer Details</Link>
                    <Link to="/quickaccess" className={isActive("/quickaccess") ? "active" : ""}>Quick Access</Link>
                  </div>
                </div>

                <div className="menu">
                  <button className="menu-button" onClick={() => toggleMenu("habits")}>
                    <IconRepeat size={18} />
                    <span>Customer Habits</span>
                    <span className="menu-chevron">
                      {openMenu === "habits" ? <IconChevronUp size={16} /> : <IconChevronDown size={16} />}
                    </span>
                  </button>
                  <div className={`submenu${openMenu === "habits" ? " open" : ""}`}>
                    <Link to="/customers/frequency/1" className={isActive("/customers/frequency/1") ? "active" : ""}>Daily Customers</Link>
                    <Link to="/customers/frequency/2" className={isActive("/customers/frequency/2") ? "active" : ""}>Alternate Customers</Link>
                    <Link to="/customers/frequency/3" className={isActive("/customers/frequency/3") ? "active" : ""}>Ternary Customers</Link>
                    <div className="submenu-item" onClick={() => setCustomerFrequencyModal(true)}>Custom Interval</div>
                  </div>
                </div>

                <div className="nav-section-label">Operations</div>
                <div className="menu">
                  <button className="menu-button" onClick={() => toggleMenu("entries")}>
                    <IconPencil size={18} />
                    <span>Entries</span>
                    <span className="menu-chevron">
                      {openMenu === "entries" ? <IconChevronUp size={16} /> : <IconChevronDown size={16} />}
                    </span>
                  </button>
                  <div className={`submenu${openMenu === "entries" ? " open" : ""}`}>
                    <Link to="/delivery/new" className={isActive("/delivery/new") ? "active" : ""}>New Delivery</Link>
                    <Link to="/payment/new" className={isActive("/payment/new") ? "active" : ""}>New Payment</Link>
                  </div>
                </div>

                <div className="menu">
                  <button className="menu-button" onClick={() => toggleMenu("reports")}>
                    <IconReportAnalytics size={18} />
                    <span>Reports</span>
                    <span className="menu-chevron">
                      {openMenu === "reports" ? <IconChevronUp size={16} /> : <IconChevronDown size={16} />}
                    </span>
                  </button>
                  <div className={`submenu${openMenu === "reports" ? " open" : ""}`}>
                    <Link to="/deliveries?deliveryDate=today" className={isActive("/deliveries?deliveryDate=today") ? "active" : ""}>Today's Deliveries</Link>
                    <Link to="/deliveries?deliveryDate=yesterday" className={isActive("/deliveries?deliveryDate=yesterday") ? "active" : ""}>Yesterday's Deliveries</Link>
                    <div className="submenu-item" onClick={() => setDeliveryModal(true)}>Custom Day Deliveries</div>
                    <div className="submenu-item" onClick={() => setDeliveryRangeModal(true)}>Date Range Deliveries</div>
                    <div className="submenu-divider" />
                    <Link to="/payments?paymentDate=today" className={isActive("/payments?paymentDate=today") ? "active" : ""}>Today's Payments</Link>
                    <Link to="/payments?paymentDate=yesterday" className={isActive("/payments?paymentDate=yesterday") ? "active" : ""}>Yesterday's Payments</Link>
                    <div className="submenu-item" onClick={() => setPaymentModal(true)}>Custom Payments</div>
                    <div className="submenu-item" onClick={() => setPaymentRangeModal(true)}>Date Range Payments</div>
                  </div>
                </div>

                <div className="menu">
                  <button className="menu-button" onClick={() => toggleMenu("expense")}>
                    <IconReceipt size={18} />
                    <span>Expense</span>
                    <span className="menu-chevron">
                      {openMenu === "expense" ? <IconChevronUp size={16} /> : <IconChevronDown size={16} />}
                    </span>
                  </button>
                  <div className={`submenu${openMenu === "expense" ? " open" : ""}`}>
                    <Link to="/expense/new" className={isActive("/expense/new") ? "active" : ""}>Create Expense</Link>
                    <Link to="/expenses/today" className={isActive("/expenses/today") ? "active" : ""}>Today's Expense</Link>
                    <Link to="/expenses/yesterday" className={isActive("/expenses/yesterday") ? "active" : ""}>Yesterday's Expense</Link>
                    <div className="submenu-item" onClick={() => setExpenseModal(true)}>Custom Date Expenses</div>
                  </div>
                </div>

                <div className="menu">
                  <button className="menu-button" onClick={() => toggleMenu("prediction")}>
                    <IconTrendingUp size={18} />
                    <span>Prediction</span>
                    <span className="menu-chevron">
                      {openMenu === "prediction" ? <IconChevronUp size={16} /> : <IconChevronDown size={16} />}
                    </span>
                  </button>
                  <div className={`submenu${openMenu === "prediction" ? " open" : ""}`}>
                    <Link to="/customerspredictions?nextDelivery=tomorrow" className={isActive("/customerspredictions?nextDelivery=tomorrow") ? "active" : ""}>Expected Tomorrow</Link>
                    <Link to="/customerspredictions?nextDelivery=today" className={isActive("/customerspredictions?nextDelivery=today") ? "active" : ""}>Expected Today</Link>
                    <div className="submenu-item" onClick={() => setPredictionModal(true)}>Custom Date Prediction</div>
                  </div>
                </div>

                <div className="menu">
                  <button className="menu-button" onClick={() => toggleMenu("jarcount")}>
                    <IconHexagon size={18} />
                    <span>Jar Count</span>
                    <span className="menu-chevron">
                      {openMenu === "jarcount" ? <IconChevronUp size={16} /> : <IconChevronDown size={16} />}
                    </span>
                  </button>
                  <div className={`submenu${openMenu === "jarcount" ? " open" : ""}`}>
                    <Link to="/jarInventory/today" className={isActive("/jarInventory/today") ? "active" : ""}>Today's Jar Count</Link>
                    <Link to="/jarInventory" className={isActive("/jarInventory") ? "active" : ""}>Jar Inventory</Link>
                  </div>
                </div>
              </>
            )}

            <div className="menu">
              <button className="menu-button" onClick={() => toggleMenu("trips")}>
                <IconTruckDelivery size={18} />
                <span>Delivery Trips</span>
                <span className="menu-chevron">
                  {openMenu === "trips" ? <IconChevronUp size={16} /> : <IconChevronDown size={16} />}
                </span>
              </button>
              <div className={`submenu${openMenu === "trips" ? " open" : ""}`}>
                <Link to="/makeDeliveryList" className={isActive("/makeDeliveryList") ? "active" : ""}>Make Trips</Link>
                <Link to="/trips" className={isActive("/trips") ? "active" : ""}>Modify Trips</Link>
                <Link to="/arrangetrips" className={isActive("/arrangetrips") ? "active" : ""}>Arrange Trips</Link>
              </div>
            </div>

            {user.role === "admin" && (
              <div className="nav-section-label">Analytics</div>
            )}
            {user.role === "admin" && (
              <div className="menu">
                <button className="menu-button" onClick={() => toggleMenu("sales")}>
                  <IconChartBar size={18} />
                  <span>Sales Report</span>
                  <span className="menu-chevron">
                    {openMenu === "sales" ? <IconChevronUp size={16} /> : <IconChevronDown size={16} />}
                  </span>
                </button>
                <div className={`submenu${openMenu === "sales" ? " open" : ""}`}>
                  <div className="submenu-item" onClick={() => setSalesDailyModal(true)}>Daily Report</div>
                  <div className="submenu-item" onClick={() => setSalesMonthlyModal(true)}>Monthly Report</div>
                  <div className="submenu-item" onClick={() => setSalesDetailedMonthlyModal(true)}>Detailed Monthly Report</div>
                </div>
              </div>
            )}

            {user.role === "admin" && (
              <>
                <div className="nav-section-label">Admin</div>
                <div className="menu">
                  <Link
                    to="/admin/create-user"
                    className={`menu-button${isActive("/admin/create-user") ? " active" : ""}`}
                  >
                    <IconUserPlus size={18} />
                    <span>Create User</span>
                  </Link>
                </div>
              </>
            )}

            {(user.role === "delivery" || user.role === "admin") && (
              <div className="menu">
                <button className="menu-button" onClick={() => toggleMenu("delivery-panel")}>
                  <IconMapPin size={18} />
                  <span>Delivery Panel</span>
                  <span className="menu-chevron">
                    {openMenu === "delivery-panel" ? <IconChevronUp size={16} /> : <IconChevronDown size={16} />}
                  </span>
                </button>
                <div className={`submenu${openMenu === "delivery-panel" ? " open" : ""}`}>
                  <Link to="/deliveryPanel" className={isActive("/deliveryPanel") ? "active" : ""}>Open Panel</Link>
                </div>
              </div>
            )}

            <div className="nav-user">
              <div className="nav-user-avatar">
                {user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
              </div>
              <div className="nav-user-info">
                <span className="nav-user-name">{user.name}</span>
                <span className="nav-user-meta">
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  {" · "}
                  <span className="nav-user-logout" onClick={logoutUser}>Logout</span>
                </span>
              </div>
            </div>

          </nav>
        </div>
      )}

      {createPortal(
        <>
          {paymentModal && (
            <div className="modal">
              <div className="modal-bg"></div>
              <div className="modal-text">
                <label className="customInputLabel">Enter Payment Date</label>
                <input
                  className="customPayment"
                  type="date"
                  value={customPaymentDate}
                  onChange={(e) => setCustomPaymentDate(e.target.value)}
                />
                <button
                  className="submitPaymentdate common-cta-blue"
                  onClick={handlePaymentModalSubmit}
                >
                  Submit
                </button>
                <div
                  className="closeModal"
                  onClick={() => setPaymentModal(false)}
                >
                  &#x2715;
                </div>
              </div>
            </div>
          )}

          {paymentRangeModal && (
            <div className="modal">
              <div className="modal-bg"></div>
              <div className="modal-text">
                <label className="customInputLabel">
                  Enter Payment Start Date
                </label>
                <input
                  className="customPayment"
                  type="date"
                  value={customPaymentDateRangeStart}
                  onChange={(e) =>
                    setCustomPaymentDateRangeStart(e.target.value)
                  }
                />
                <label className="customInputLabel">
                  Enter Payment End Date
                </label>
                <input
                  className="customPayment"
                  type="date"
                  value={customPaymentDateRangeEnd}
                  onChange={(e) =>
                    setCustomPaymentDateRangeEnd(e.target.value)
                  }
                />
                <button
                  className="submitDeliverydate common-cta-blue"
                  onClick={handlePaymentRangeModalSubmit}
                >
                  Submit
                </button>
                <div
                  className="closeModal"
                  onClick={() => setPaymentRangeModal(false)}
                >
                  &#x2715;
                </div>
              </div>
            </div>
          )}

          {deliveryModal && (
            <div className="modal">
              <div className="modal-bg"></div>
              <div className="modal-text">
                <label className="customInputLabel">Enter Delivery Date</label>
                <input
                  className="customDelivery"
                  type="date"
                  value={customDeliveryDate}
                  onChange={(e) => setCustomDeliveryDate(e.target.value)}
                />
                <button
                  className="submitDeliverydate common-cta-blue"
                  onClick={handleDeliveryModalSubmit}
                >
                  Submit
                </button>
                <div
                  className="closeModal"
                  onClick={() => setDeliveryModal(false)}
                >
                  &#x2715;
                </div>
              </div>
            </div>
          )}

          {deliveryRangeModal && (
            <div className="modal">
              <div className="modal-bg"></div>
              <div className="modal-text">
                <label className="customInputLabel">
                  Enter Delivery Start Date
                </label>
                <input
                  className="customDelivery"
                  type="date"
                  value={customDeliveryDateRangeStart}
                  onChange={(e) =>
                    setCustomDeliveryDateRangeStart(e.target.value)
                  }
                />
                <label className="customInputLabel">
                  Enter Delivery End Date
                </label>
                <input
                  className="customDelivery"
                  type="date"
                  value={customDeliveryDateRangeEnd}
                  onChange={(e) =>
                    setCustomDeliveryDateRangeEnd(e.target.value)
                  }
                />
                <button
                  className="submitDeliverydate common-cta-blue"
                  onClick={handleDeliveryRangeModalSubmit}
                >
                  Submit
                </button>
                <div
                  className="closeModal"
                  onClick={() => setDeliveryRangeModal(false)}
                >
                  &#x2715;
                </div>
              </div>
            </div>
          )}

          {customerFrequencyModal && (
            <div className="modal">
              <div className="modal-bg"></div>
              <div className="modal-text">
                <label className="customInputLabel">Enter Customer's</label>
                <label className="customInputLabel">Frequency Number</label>
                <input
                  className="customFrequencyInput"
                  type="number"
                  value={customFrequencyNumber}
                  onChange={(e) => setCustomFrequencyNumber(e.target.value)}
                />
                <button
                  className="submitFrequencynumber common-cta-blue"
                  onClick={handleCustomerFrequencyModalSubmit}
                >
                  Submit
                </button>
                <div
                  className="closeModal"
                  onClick={() => setCustomerFrequencyModal(false)}
                >
                  &#x2715;
                </div>
              </div>
            </div>
          )}

          {expenseModal && (
            <div className="modal">
              <div className="modal-bg"></div>
              <div className="modal-text">
                <label className="customInputLabel">Enter Expense Date</label>
                <input
                  className="customExpense"
                  type="date"
                  value={customExpenseDate}
                  onChange={(e) => setCustomExpenseDate(e.target.value)}
                />
                <button
                  className="submitExpensedate common-cta-blue"
                  onClick={handleExpenseModalSubmit}
                >
                  Submit
                </button>
                <div
                  className="closeModal"
                  onClick={() => setExpenseModal(false)}
                >
                  &#x2715;
                </div>
              </div>
            </div>
          )}

          {predictionModal && (
            <div className="modal">
              <div className="modal-bg"></div>
              <div className="modal-text">
                <label className="customInputLabel">Enter Prediction Date</label>
                <input
                  className="customPrediction"
                  type="date"
                  value={customPredictionDate}
                  onChange={(e) => setCustomPredictionDate(e.target.value)}
                />
                <button
                  className="submitPredictiondate common-cta-blue"
                  onClick={handlePredictionModalSubmit}
                >
                  Submit
                </button>
                <div
                  className="closeModal"
                  onClick={() => setPredictionModal(false)}
                >
                  &#x2715;
                </div>
              </div>
            </div>
          )}

          {salesDailyModal && (
            <div className="modal">
              <div className="modal-bg"></div>
              <div className="modal-text">
                <label className="customInputLabel">Enter Sales Date</label>
                <input
                  type="date"
                  value={salesDailyDate}
                  onChange={(e) => setSalesDailyDate(e.target.value)}
                />
                <button
                  className="submitPredictiondate common-cta-blue"
                  onClick={handleSalesDailyModalSubmit}
                >
                  Submit
                </button>
                <div
                  className="closeModal"
                  onClick={() => setSalesDailyModal(false)}
                >
                  &#x2715;
                </div>
              </div>
            </div>
          )}

          {salesMonthlyModal && (
            <div className="modal">
              <div className="modal-bg"></div>
              <div className="modal-text">
                <label className="customInputLabel">Enter Sales Month-Year</label>
                <input
                  type="month"
                  value={salesMonthlyDate || "YYYY-MM"}
                  placeholder="Enter Year and Month"
                  onChange={(e) => setSalesMonthlyDate(e.target.value)}
                />
                <button
                  className="submitPredictiondate common-cta-blue"
                  onClick={handleSalesMonthlyModalSubmit}
                >
                  Submit
                </button>
                <div
                  className="closeModal"
                  onClick={() => setSalesMonthlyModal(false)}
                >
                  &#x2715;
                </div>
              </div>
            </div>
          )}

          {salesDetailedMonthlyModal && (
            <div className="modal">
              <div className="modal-bg"></div>
              <div className="modal-text">
                <label className="customInputLabel">Enter Sales Month-Year</label>
                <input
                  type="month"
                  value={salesDetailedMonthlyDate || "YYYY-MM"}
                  placeholder="Enter Year and Month"
                  onChange={(e) => setSalesDetailedMonthlyDate(e.target.value)}
                />
                <button
                  className="submitPredictiondate common-cta-blue"
                  onClick={handleSalesDetailedMonthlyModalSubmit}
                >
                  Submit
                </button>
                <div
                  className="closeModal"
                  onClick={() => setSalesDetailedMonthlyModal(false)}
                >
                  &#x2715;
                </div>
              </div>
            </div>
          )}
        </>,
        document.body
      )}
    </>
  );
};

export default Navigation;
