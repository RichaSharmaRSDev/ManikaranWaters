import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../layout/Loader/Loader";
import Navigation from "../Navigation/Navigation";
// import { useAlert } from "react-alert";
import Title from "../layout/Title";
import { Pagination } from "../layout/Pagination/Pagination";
import ExpenseTable from "./ExpenseTable";
import { useParams } from "react-router-dom";
import { getAllExpensesByDate } from "../../actions/expenseAction";
import { clearErrors } from "../../actions/userAction";

const AllExpenses = () => {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
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
    const today = new Date(Date.now());
    expenseDate = formatDate(today);
  } else if (date === "yesterday") {
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
    expenseDate = formatDate(yesterday);
  } else {
    const customPaymentDate = new Date(date);
    expenseDate = formatDate(customPaymentDate);
  }

  // const alert = useAlert();
  const handlePageChange = (page) => {
    setCurrentPage(page);
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
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
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
