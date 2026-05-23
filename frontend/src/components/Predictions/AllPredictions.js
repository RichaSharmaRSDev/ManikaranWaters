import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { clearErrors, getCustomersByNextDeliveryDate } from "../../actions/customerAction";
import Loader from "../layout/Loader/Loader";
import Navigation from "../Navigation/Navigation";
import { todayIST, tomorrowIST } from "../../utils/istDate";
import HabitsCustomerTable from "../Customers/HabitsCustomerTable";
import "../Customers/Table.scss";
import Title from "../layout/Title";
import { Pagination } from "../layout/Pagination/Pagination";

const AllPredictions = () => {
  const dispatch = useDispatch();
  const { showNavigation } = useSelector((state) => state.navigation);
  const { customersPredictions, customersPredictionsCount, error, loading } =
    useSelector((state) => state.customers) || {};

  const [activeTab, setActiveTab] = useState("today");
  const [customDate, setCustomDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const effectiveDate =
    activeTab === "today" ? todayIST()
    : activeTab === "tomorrow" ? tomorrowIST()
    : customDate;

  const totalPages = Math.ceil((customersPredictionsCount || 0) / 20);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, customDate]);

  useEffect(() => {
    if (!effectiveDate) return;
    dispatch(getCustomersByNextDeliveryDate(effectiveDate, currentPage));
  }, [effectiveDate, currentPage]);

  useEffect(() => {
    if (error) {
      console.log(error);
      dispatch(clearErrors());
    }
  }, [error]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab !== "custom") setCustomDate("");
  };

  return (
    <>
      <Title title="Prediction" />
      <Navigation />
      <div className={showNavigation ? "beNeutral" : "shiftLeft"}>
        <h2 className="common-heading">Prediction</h2>

        <div className="rp-period-bar">
          <button
            className={`rp-period-btn${activeTab === "today" ? " active" : ""}`}
            onClick={() => handleTabChange("today")}
          >
            Today
          </button>
          <button
            className={`rp-period-btn${activeTab === "tomorrow" ? " active" : ""}`}
            onClick={() => handleTabChange("tomorrow")}
          >
            Tomorrow
          </button>
          <span className="rp-period-sep">|</span>
          <button
            className={`rp-period-btn${activeTab === "custom" ? " active" : ""}`}
            onClick={() => handleTabChange("custom")}
          >
            Custom
          </button>
          {activeTab === "custom" && (
            <div className="rp-datepicker-chip">
              <input
                type="date"
                value={customDate}
                onChange={(e) => setCustomDate(e.target.value)}
                autoFocus
              />
            </div>
          )}
        </div>

        {loading ? (
          <Loader />
        ) : customersPredictions?.length ? (
          <>
            <HabitsCustomerTable customers={customersPredictions} />
            {totalPages > 1 && (
              <>
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={(p) => { setCurrentPage(p); window.scrollTo(0, 0); }}
                />
                <span style={{ fontSize: "12px", color: "#7a8fa6" }}>
                  Page {currentPage} of {totalPages}
                </span>
              </>
            )}
          </>
        ) : (
          !loading && effectiveDate && (
            <div className="noResults">
              <span>No deliveries predicted for this date</span>
            </div>
          )
        )}
      </div>
    </>
  );
};

export default AllPredictions;
