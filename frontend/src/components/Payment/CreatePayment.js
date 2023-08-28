import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createPayment } from "../../actions/paymentAction";
import Loader from "../layout/Loader/Loader.js";
import { getCustomersIdName } from "../../actions/customerAction";
import IdLogo from "../../assets/id-badge.svg";
import deliveryDateLogo from "../../assets/calendar-check.svg";
import Navigation from "../Navigation/Navigation";
import Ruppee from "../../assets/indian-rupee-sign.svg";
import { useAlert } from "react-alert";

const CreatePayment = () => {
  const { showNavigation } = useSelector((state) => state.navigation);
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.user);
  const { customers } = useSelector((state) => state.customers);
  const { loading, error, success } = useSelector((state) => state.payments);
  const [matchedCustomer, setMatchedCustomerName] = useState("");
  const alert = useAlert();
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getCustomersIdName());
    }
    if (success) {
      alert.success("Payment Created Successfully");
    }
    if (error) {
      alert.error(error);
    }
  }, [error]);

  const initialState = {
    customerId: "",
    paymentDate: new Date(Date.now() + 5.5 * 60 * 60 * 1000),
    amount: 0,
    paymentMode: "",
  };
  const [formData, setFormData] = useState(initialState);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({ ...prevData, [name]: value }));

    if (name === "customerId") {
      const matchedCustomer = customers.find(
        (customer) => customer.customerId === value
      );

      if (matchedCustomer) {
        setMatchedCustomerName(matchedCustomer.name);
      } else {
        setMatchedCustomerName("");
      }
    }
  };

  const handleDeliverySubmit = (e) => {
    e.preventDefault();
    dispatch(createPayment(formData));
    setFormData(initialState);
    setMatchedCustomerName("");
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <Navigation />
          <div className={showNavigation ? "beNeutral" : "shiftLeft"}>
            <h2 className="common-heading common-heading-form">
              Create Payment
            </h2>
            <form
              onSubmit={handleDeliverySubmit}
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
                    required
                  />
                </div>
                <div className="fields">
                  <label htmlFor="paymentMode">Payment Mode: </label>
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
        </>
      )}
    </>
  );
};

export default CreatePayment;
