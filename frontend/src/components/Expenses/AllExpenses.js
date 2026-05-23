import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../layout/Loader/Loader";
import Navigation from "../Navigation/Navigation";
import { todayIST, yesterdayIST } from "../../utils/istDate";
import Title from "../layout/Title";
import { Pagination } from "../layout/Pagination/Pagination";
import ExpenseTable from "./ExpenseTable";
import { getAllExpensesByDate } from "../../actions/expenseAction";
import { clearErrors } from "../../actions/userAction";

const AllExpenses = () => {
  const dispatch = useDispatch();
  const { showNavigation } = useSelector((state) => state.navigation);
  const { expenses, error, loading, expenseCount, expenseTotal } =
    useSelector((state) => state.expenses) || {};

  const [activeTab, setActiveTab] = useState("today");
  const [customDate, setCustomDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const effectiveDate =
    activeTab === "today" ? todayIST()
    : activeTab === "yesterday" ? yesterdayIST()
    : customDate;

  const totalPages = Math.ceil((expenseCount || 0) / 20);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, customDate]);

  useEffect(() => {
    if (!effectiveDate) return;
    dispatch(getAllExpensesByDate(effectiveDate, currentPage));
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
      <Title title="Expense Reports" />
      <Navigation />
      <div className={showNavigation ? "beNeutral" : "shiftLeft"}>
        <h2 className="common-heading">Expense Reports</h2>

        <div className="rp-period-bar">
          <button
            className={`rp-period-btn${activeTab === "today" ? " active" : ""}`}
            onClick={() => handleTabChange("today")}
          >
            Today
          </button>
          <button
            className={`rp-period-btn${activeTab === "yesterday" ? " active" : ""}`}
            onClick={() => handleTabChange("yesterday")}
          >
            Yesterday
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
        ) : expenses?.length ? (
          <>
            <ExpenseTable expenses={expenses} expenseTotal={expenseTotal} />
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
              <span>No expenses found for this period</span>
            </div>
          )
        )}
      </div>
    </>
  );
};

export default AllExpenses;
