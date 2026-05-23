import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearErrors, frequencyCustomers } from "../../actions/customerAction";
import Navigation from "../Navigation/Navigation";
import Loader from "../layout/Loader/Loader";
import HabitsCustomerTable from "./HabitsCustomerTable";
import { Pagination } from "../layout/Pagination/Pagination";
import Title from "../layout/Title";
import "./Table.scss";

const PILLS = [
  { key: "1", label: "Daily" },
  { key: "2", label: "Alternate" },
  { key: "3", label: "Ternary" },
];

const FrequencyCustomers = () => {
  const dispatch = useDispatch();
  const { showNavigation } = useSelector((state) => state.navigation);
  const { loading, customers, error, customerFeatureCount } =
    useSelector((state) => state.customers);

  const [activeFreq, setActiveFreq] = useState("1");
  const [customInput, setCustomInput] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const effectiveFreq = activeFreq === "custom" ? customInput : activeFreq;

  useEffect(() => {
    if (!effectiveFreq) return;
    dispatch(frequencyCustomers(effectiveFreq, currentPage));
  }, [effectiveFreq, currentPage]);

  useEffect(() => {
    if (error) {
      console.log(error);
      dispatch(clearErrors());
    }
  }, [error]);

  const totalPages = Math.ceil((customerFeatureCount || 0) / 20);

  const handleFreqChange = (key) => {
    setActiveFreq(key);
    setCurrentPage(1);
    if (key !== "custom") setCustomInput("");
  };

  return (
    <>
      <Title title="Customer Habits" />
      <Navigation />
      <div className={showNavigation ? "beNeutral" : "shiftLeft"}>
        <h2 className="common-heading">Customer Habits</h2>

        <div className="rp-period-bar">
          {PILLS.map((p) => (
            <button
              key={p.key}
              className={`rp-period-btn${activeFreq === p.key ? " active" : ""}`}
              onClick={() => handleFreqChange(p.key)}
            >
              {p.label}
            </button>
          ))}
          <span className="rp-period-sep">|</span>
          <button
            className={`rp-period-btn${activeFreq === "custom" ? " active" : ""}`}
            onClick={() => handleFreqChange("custom")}
          >
            Custom
          </button>
          {activeFreq === "custom" && (
            <div className="rp-datepicker-chip">
              <input
                type="number"
                min="1"
                value={customInput}
                placeholder="days"
                style={{ width: "52px" }}
                onChange={(e) => {
                  setCustomInput(e.target.value);
                  setCurrentPage(1);
                }}
                autoFocus
              />
            </div>
          )}
        </div>

        {loading ? (
          <Loader />
        ) : customers?.length ? (
          <>
            <HabitsCustomerTable customers={customers} frequencyField={false} />
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
          !loading && effectiveFreq && (
            <div className="noResults">
              <span>No customers found</span>
            </div>
          )
        )}
      </div>
    </>
  );
};

export default FrequencyCustomers;
