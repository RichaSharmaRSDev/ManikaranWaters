import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createExpense, clearNewExpense } from "../../actions/expenseAction.js";
import Loader from "../layout/Loader/Loader.js";
import deliveryDateLogo from "../../assets/calendar-check.svg";
import Navigation from "../Navigation/Navigation";
import Ruppee from "../../assets/indian-rupee-sign.svg";
import Type from "../../assets/rectangle-list.svg";
// import { useAlert } from "react-alert";
import Title from "../layout/Title.js";

const CreateExpenses = () => {
  const { showNavigation } = useSelector((state) => state.navigation);
  const dispatch = useDispatch();
  const { loading, isAuthenticated } = useSelector((state) => state.user);
  const { newExpenseError, newExpenseSuccess, newExpense } = useSelector(
    (state) => state.expenses
  );
  // const alert = useAlert();
  useEffect(() => {
    if (newExpenseError) {
      console.log(newExpenseError);
    }
  }, [newExpenseError]);

  const initialState = {
    expenseDate: new Date(Date.now() + 5.5 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    category: "",
    amount: 0,
    description: "",
  };
  const [formData, setFormData] = useState(initialState);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleExpenseSubmit = (e) => {
    e.preventDefault();
    dispatch(createExpense(formData));
    setFormData(initialState);
  };

  const handleCloseModal = () => {
    dispatch(clearNewExpense());
    setFormData(initialState);
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <Title title={"Create New Expense"} />
          <Navigation />
          <div className={showNavigation ? "beNeutral" : "shiftLeft"}>
            <h2 className="common-heading common-heading-form">
              Create Expense
            </h2>
            <form
              onSubmit={handleExpenseSubmit}
              className="createForm expenseForm"
            >
              <div className="fields-wrapper">
                <div className="fields">
                  <label htmlFor="date">
                    <img src={deliveryDateLogo} alt="date" />
                    Expense Date:
                  </label>
                  <input
                    type="date"
                    name="expenseDate"
                    placeholder="date"
                    value={formData.expenseDate}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="fields">
                  <label htmlFor="category">
                    <img src={Type} alt="rate" />
                    Expense Type:
                  </label>
                  <select
                    type="number"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Expense Type</option>
                    <option value="Food">Food</option>
                    <option value="Staff Payments">Staff Payments</option>
                    <option value="Vehicle">Vehicle</option>
                    <option value="Plant Related">Plant Related</option>
                    <option value="Electricity Bills">Electricity Bills</option>
                    <option value="New Jars">New Jars</option>
                    <option value="New Caps">New Caps</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="fields">
                  <label htmlFor="amount">
                    <img src={Ruppee} alt="rate" />
                    Amount Spent:
                  </label>
                  <input
                    type="number"
                    name="amount"
                    placeholder="Amount Received"
                    value={formData.amount}
                    onChange={handleInputChange}
                    min="1"
                    required
                  />
                </div>
                <div className="fields">
                  <label htmlFor="description">
                    <img src={Ruppee} alt="rate" />
                    Description
                  </label>
                  <textarea
                    name="description"
                    placeholder="Description of expense"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="2"
                    cols="50"
                  />
                </div>

                <button className="common-cta" type="submit">
                  Create Expense
                </button>
              </div>
            </form>
          </div>
          {newExpense && (
            <div className="modal payment-modal">
              <div className="modal-bg"></div>
              <div className="modal-text">
                {newExpenseSuccess && <h3>Expense Created Successfully</h3>}

                <div className="values">
                  <span>Expense Date:</span>{" "}
                  {new Date(newExpense.expenseDate).toLocaleDateString(
                    "en-GB",
                    { day: "2-digit", month: "short" }
                  )}
                </div>

                <div className="values">
                  <span>Expense Type:</span>
                  <span>{newExpense.category}</span>
                </div>
                <div className="values">
                  <span>Expense Amount:</span>
                  <span>{newExpense.amount}</span>
                </div>
                <div className="values">
                  <span>Expense Description:</span>
                  <span>{newExpense.description}</span>
                </div>

                <div className="closeModal" onClick={handleCloseModal}>
                  &#x2715;
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default CreateExpenses;
