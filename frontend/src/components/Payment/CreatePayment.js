import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createPayment, clearNewPayment } from "../../actions/paymentAction";
import Loader from "../layout/Loader/Loader.js";
import { getCustomersIdName } from "../../actions/customerAction";
import IdLogo from "../../assets/id-badge.svg";
import CardLogo from "../../assets/credit-card.svg";
import deliveryDateLogo from "../../assets/calendar-check.svg";
import Navigation from "../Navigation/Navigation";
import Ruppee from "../../assets/indian-rupee-sign.svg";
// import { useAlert } from "react-alert";
import Title from "../layout/Title";

const CreatePayment = () => {
  const { showNavigation } = useSelector((state) => state.navigation);
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.user);
  const { customers } = useSelector((state) => state.customers);
  const { loading, error, success, newPayment } = useSelector(
    (state) => state.payments
  );
  const [matchedCustomer, setMatchedCustomer] = useState("");
  // const alert = useAlert();
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getCustomersIdName());
    }

    if (error) {
      console.log(error);
    }
  }, [error]);

  const initialState = {
    customerId: "",
    paymentDate: new Date(Date.now() + 5.5 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    amount: 0,
    paymentMode: "",
  };
  const [formData, setFormData] = useState(initialState);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({ ...prevData, [name]: value }));

    if (name === "customerId") {
      const uppercaseValue = value.toUpperCase();
      setFormData((prevData) => ({ ...prevData, [name]: uppercaseValue }));

      const matchedCustomer = customers.find(
        (customer) => customer.customerId === value
      );
      if (matchedCustomer) {
        setMatchedCustomer(matchedCustomer.name);
      } else {
        setMatchedCustomer("");
      }
    }
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    dispatch(createPayment(formData));
  };

  const handleCloseModal = () => {
    dispatch(clearNewPayment());
    setFormData(initialState);
    setMatchedCustomer("");
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <Navigation />
          <Title title={"Create New Payment"} />
          <div className={showNavigation ? "beNeutral" : "shiftLeft"}>
            <h2 className="common-heading common-heading-form">
              Create Payment
            </h2>
            <form
              onSubmit={handlePaymentSubmit}
              className="createForm paymentForm"
            >
              <div className="fields-wrapper">
                <div className="fields">
                  <label htmlFor="customerId">
                    <img src={IdLogo} alt="id" />
                    Customer Id:
                  </label>
                  <input
                    type="string"
                    name="customerId"
                    placeholder="Customer Id"
                    value={formData.customerId}
                    onChange={handleInputChange}
                    required
                  />
                  {matchedCustomer && (
                    <p className="extraNote">
                      <span>Verified Name:</span> {matchedCustomer}
                    </p>
                  )}
                </div>
                <div className="fields">
                  <label htmlFor="date">
                    <img src={deliveryDateLogo} alt="date" />
                    Payment Date:
                  </label>
                  <input
                    type="date"
                    name="paymentDate"
                    placeholder="date"
                    value={formData.paymentDate}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="fields">
                  <label htmlFor="amount">
                    <img src={Ruppee} alt="rate" />
                    Amount Received:
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
                  <label htmlFor="paymentMode">
                    <img src={CardLogo} alt="id" />
                    Payment Mode:{" "}
                  </label>
                  <select
                    name="paymentMode"
                    value={formData.paymentMode}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Payment Mode</option>
                    <option value="cash">Cash</option>
                    <option value="online">Online</option>
                  </select>
                </div>
                <button className="common-cta" type="submit">
                  Create Payment
                </button>
              </div>
            </form>
          </div>
          {newPayment && (
            <div className="modal payment-modal">
              <div className="modal-bg"></div>
              <div className="modal-text">
                {success && <h3>Payment Created Successfully</h3>}
                <div className="values">
                  <span>Name:</span> <span>{matchedCustomer}</span>
                </div>
                <div className="values">
                  <span>CustomerId:</span> <span>{newPayment.customer}</span>
                </div>
                <div className="values">
                  <span>Payment Date:</span>{" "}
                  {new Date(newPayment.paymentDate).toLocaleDateString(
                    "en-GB",
                    { day: "2-digit", month: "short" }
                  )}
                </div>
                {newPayment.amount && (
                  <>
                    <div className="values">
                      <span>Amount Received:</span>
                      <span>{newPayment.amount}</span>
                    </div>
                    <div className="values">
                      <span>Payment Mode:</span>
                      <span>{newPayment.paymentMode}</span>
                    </div>
                  </>
                )}
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

export default CreatePayment;
