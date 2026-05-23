import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createExpense, clearNewExpense } from "../../actions/expenseAction.js";
import Loader from "../layout/Loader/Loader.js";
import Navigation from "../Navigation/Navigation";
import { todayIST } from "../../utils/istDate";
import Title from "../layout/Title.js";

const CATEGORIES = [
  "Food", "Staff Payments", "Vehicle", "Plant Related",
  "Electricity Bills", "New Jars", "New Caps", "Other",
];

const CreateExpense = () => {
  const { showNavigation } = useSelector((state) => state.navigation);
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.user);
  const { newExpenseError, newExpenseSuccess, newExpense } = useSelector(
    (state) => state.expenses
  );

  useEffect(() => {
    if (newExpenseError) console.log(newExpenseError);
  }, [newExpenseError]);

  const initialState = { expenseDate: todayIST(), category: "", amount: "", description: "" };
  const [formData, setFormData] = useState(initialState);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
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
          <Title title="New Expense" />
          <Navigation />
          <div className={showNavigation ? "beNeutral" : "shiftLeft"}>
            <h2 className="common-heading">New Expense</h2>
            <div className="create-customer">
              <form onSubmit={handleSubmit}>
                <div className="form-section">
                  <div className="form-section__header">Expense Details</div>
                  <div className="form-grid">
                    <div className="form-field">
                      <label className="form-label" htmlFor="expenseDate">Date</label>
                      <input
                        className="form-input"
                        type="date"
                        id="expenseDate"
                        name="expenseDate"
                        value={formData.expenseDate}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="form-field">
                      <label className="form-label" htmlFor="category">Category</label>
                      <select
                        className="form-select"
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select category...</option>
                        {CATEGORIES.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-field">
                      <label className="form-label" htmlFor="amount">Amount (₹)</label>
                      <input
                        className="form-input"
                        type="number"
                        id="amount"
                        name="amount"
                        placeholder="0"
                        value={formData.amount}
                        onChange={handleInputChange}
                        min="1"
                        required
                      />
                    </div>
                    <div className="form-field">
                      <label className="form-label" htmlFor="description">Description</label>
                      <input
                        className="form-input"
                        type="text"
                        id="description"
                        name="description"
                        placeholder="Optional note"
                        value={formData.description}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>
                <div className="form-actions">
                  <button className="btn btn--primary" type="submit">Save Expense</button>
                </div>
              </form>
            </div>
          </div>

          {newExpense && (
            <div className="modal payment-modal">
              <div className="modal-bg"></div>
              <div className="modal-text">
                {newExpenseSuccess && <h3>Expense Saved</h3>}
                <div className="values">
                  <span>Date:</span>{" "}
                  {new Date(newExpense.expenseDate).toLocaleDateString("en-GB", {
                    day: "2-digit", month: "short", timeZone: "Asia/Kolkata",
                  })}
                </div>
                <div className="values"><span>Category:</span><span>{newExpense.category}</span></div>
                <div className="values"><span>Amount:</span><span>₹{newExpense.amount}</span></div>
                {newExpense.description && (
                  <div className="values"><span>Note:</span><span>{newExpense.description}</span></div>
                )}
                <div className="closeModal" onClick={handleCloseModal}>&#x2715;</div>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default CreateExpense;
