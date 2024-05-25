import React, { useState, useEffect } from "react";
import Loader from "../layout/Loader/Loader";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { logout } from "../../actions/userAction";
import { useDispatch, useSelector } from "react-redux";
import logoutSvg from "../../assets/sign-out-alt.svg";
import "./navigation.scss";
import expandCollapseLogo from "../../assets/expandCollapse.svg";
// import { useAlert } from "react-alert";
import { toggleNavigation } from "../../actions/navigationAction";

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
          <div className="profileDetails">
            <h3>Hi {user.name}!</h3>
            <div className="logout-container" onClick={logoutUser}>
              <button>Logout</button>
              <img src={logoutSvg} alt="logout" />
            </div>
          </div>
          <nav className={`${showNavigation ? "show" : "hide"}`}>
            <button
              className="menu-toggle-button"
              onClick={toggleNavigationInside}
            >
              <img
                src={expandCollapseLogo}
                className={`${showNavigation ? "show" : "hide"}`}
                alt="toggle"
              />
            </button>

            {(user.role === "admin" || user.role === "user") && (
              <>
                <div className="menu">
                  <button className="menu-button">Customer</button>
                  <div className="submenu">
                    <Link to="/customer/new">Create New Customer</Link>
                    <Link to="/customers">Customer Details</Link>
                    <Link to="/quickaccess">Quick Access</Link>
                  </div>
                </div>

                {/* Customer Habits */}
                <div className="menu">
                  <button className="menu-button">Customer Habits</button>
                  <div className="submenu">
                    <Link to="/customers/frequency/1">Daily Customers</Link>
                    <Link to="/customers/frequency/2">Alternate Customers</Link>
                    <Link to="/customers/frequency/3">Ternary Customers</Link>
                    <div
                      className="customCustomerFrequencyLink"
                      to="#"
                      onClick={() => setCustomerFrequencyModal(true)}
                    >
                      Custom Interval Customers
                    </div>
                  </div>
                </div>

                {/* Enteries */}
                <div className="menu">
                  <button className="menu-button">Entries</button>
                  <div className="submenu">
                    <Link to="/delivery/new">New Delivery</Link>
                    <Link to="/payment/new">New Payment</Link>
                  </div>
                </div>

                {/* Reports */}
                <div className="menu">
                  <button className="menu-button">Reports</button>
                  <div className="submenu">
                    <Link to="/deliveries?deliveryDate=today">
                      Today's Deliveries
                    </Link>
                    <Link to="/deliveries?deliveryDate=yesterday">
                      Yesterday's Deliveries
                    </Link>
                    <div to="#" onClick={() => setDeliveryModal(true)}>
                      Custom Day Deliveries
                    </div>
                    <div
                      to="#"
                      onClick={() => setDeliveryRangeModal(true)}
                      style={{ marginTop: "10px" }}
                    >
                      Date Range Deliveries
                    </div>
                    <hr></hr>
                    <Link to="/payments?paymentDate=today">
                      Today's Payments
                    </Link>
                    <Link to="/payments?paymentDate=yesterday">
                      Yesterday's Payments
                    </Link>
                    <div
                      className="customPaymentLink"
                      to="#"
                      onClick={() => setPaymentModal(true)}
                    >
                      Custom Payments
                    </div>
                    <div
                      to="#"
                      onClick={() => setPaymentRangeModal(true)}
                      style={{ marginTop: "10px" }}
                    >
                      Date Range Payments
                    </div>
                  </div>
                </div>

                {/* Expense */}
                <div className="menu">
                  <button className="menu-button">Expense</button>
                  <div className="submenu">
                    <Link to="/expense/new">Create Expense</Link>
                    <Link to="/expenses/today">Today's Expense</Link>
                    <Link to="/expenses/yesterday">Yesterday's Expense</Link>
                    <div
                      className="customExpenseLink"
                      to="#"
                      onClick={() => setExpenseModal(true)}
                    >
                      Custom Date Expenses
                    </div>
                  </div>
                </div>

                {/* Prediction */}
                <div className="menu">
                  <button className="menu-button">Prediction</button>
                  <div className="submenu">
                    <Link to="/customerspredictions?nextDelivery=tomorrow">
                      Expected Tomorrow's Deliveries
                    </Link>
                    <Link to="/customerspredictions?nextDelivery=today">
                      Expected Today's Deliveries
                    </Link>
                    <div
                      className="customPredictionLink"
                      to="#"
                      onClick={() => setPredictionModal(true)}
                    >
                      Custom Date Prediction
                    </div>
                  </div>
                </div>

                {/* Jar Count */}
                <div className="menu">
                  <button className="menu-button">Jar Count</button>
                  <div className="submenu">
                    <Link to="/jarInventory/today">Today's Jar Count</Link>
                    <Link to="/jarInventory">Jar Inventory</Link>
                  </div>
                </div>
              </>
            )}

            {/* Delivery Trips */}
            <div className="menu">
              <button className="menu-button">Delivery Trips</button>
              <div className="submenu">
                <Link to="/makeDeliveryList">Make Trips</Link>
                <Link to="/trips">Modify Trips</Link>
                <Link to="/arrangetrips">Arrange Trips</Link>
              </div>
            </div>

            {/* Sales Report */}
            {user.role === "admin" && (
              <div className="menu">
                <button className="menu-button">Sales Report</button>
                <div className="submenu">
                  <div
                    to="#"
                    onClick={() => setSalesDailyModal(true)}
                    style={{ marginTop: "10px" }}
                  >
                    Daily Report
                  </div>
                  <div
                    to="#"
                    onClick={() => setSalesMonthlyModal(true)}
                    style={{ marginTop: "10px" }}
                  >
                    Monthly Report
                  </div>
                  <div
                    to="#"
                    onClick={() => setSalesDetailedMonthlyModal(true)}
                    style={{ marginTop: "10px" }}
                  >
                    Detailed Monthly Report
                  </div>
                </div>
              </div>
            )}

            {/* Delivery App */}
            {(user.role === "delivery" || user.role === "admin") && (
              <div className="menu">
                <button className="menu-button">
                  <Link to="/deliveryPanel">Delivery Panel</Link>
                </button>
              </div>
            )}

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
                  <label className="customInputLabel">
                    Enter Delivery Date
                  </label>
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
                  <label className="customInputLabel">
                    Enter Prediction Date
                  </label>
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
                  <label className="customInputLabel">
                    Enter Sales Month-Year
                  </label>
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
                  <label className="customInputLabel">
                    Enter Sales Month-Year
                  </label>
                  <input
                    type="month"
                    value={salesDetailedMonthlyDate || "YYYY-MM"}
                    placeholder="Enter Year and Month"
                    onChange={(e) =>
                      setSalesDetailedMonthlyDate(e.target.value)
                    }
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
          </nav>
        </div>
      )}
    </>
  );
};

export default Navigation;
