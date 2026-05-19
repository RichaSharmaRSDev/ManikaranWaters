import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../layout/Loader/Loader";
import Navigation from "../Navigation/Navigation";
import { todayIST, yesterdayIST } from "../../utils/istDate";
// import { useAlert } from "react-alert";
import Title from "../layout/Title";
import { Pagination } from "../layout/Pagination/Pagination";
import ExpenseTable from "./ExpenseTable";
import { useParams, useSearchParams } from "react-router-dom";
import { getAllExpensesByDate } from "../../actions/expenseAction";
import { clearErrors } from "../../actions/userAction";

const AllExpenses = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get("page")) || 1;
  useEffect(() => {
    if (!searchParams.get("page")) {
      setSearchParams({ page: 1 }, { replace: true });
    }
  }, []);
  const { isAuthenticated } = useSelector((state) => state.user);
  const { showNavigation } = useSelector((state) => state.navigation);
  const { expenses, success, error, loading, expenseCount, expenseTotal } =
    useSelector((state) => state.expenses) || {};
  const totalPages = Math.ceil(expenseCount / 20);

  const { date } = useParams();

  function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  let expenseDate;

  if (date === "today") {
    expenseDate = todayIST();
  } else if (date === "yesterday") {
    expenseDate = yesterdayIST();
  } else {
    const customPaymentDate = new Date(date);
    expenseDate = formatDate(customPaymentDate);
  }

  // const alert = useAlert();
  const handlePageChange = (page) => {
    setSearchParams({ page });
    window.scrollTo(0, 0);
  };
  useEffect(() => {
    dispatch(getAllExpensesByDate(expenseDate, currentPage));
  }, [expenseDate, currentPage]);
  useEffect(() => {
    if (success) {
      console.log("Received Expenses Successfully.");
    }
    if (error) {
      console.log(error);
      dispatch(clearErrors());
    }
  }, [success, error]);

  return (
    <>
      <Title title={"Expenses Details"} />
      <Navigation />
      {loading ? (
        <Loader />
      ) : (
        <>
          <div className={showNavigation ? "beNeutral" : "shiftLeft"}>
            {expenses?.length ? (
              <>
                <h2 className="common-heading">Expensess List for {date}</h2>
                <ExpenseTable expenses={expenses} expenseTotal={expenseTotal} />
                {totalPages > 1 && (
                  <>
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                    />
                    <span style={{ fontSize: "12px", color: "#7a8fa6" }}>
                      Page {currentPage} of {totalPages}
                    </span>
                  </>
                )}
              </>
            ) : (
              <div className="noResults">
                <span>No expenses available for {date}</span>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default AllExpenses;
