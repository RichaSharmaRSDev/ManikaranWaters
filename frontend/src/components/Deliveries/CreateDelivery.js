import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createDelivery } from "../../actions/deliveryAction"; // Import your delivery action
import Loader from "../../components/layout/Loader/Loader.js";
import { getCustomersIdName } from "../../actions/customerAction";
import IdLogo from "../../assets/id-badge.svg";
import deliveryDateLogo from "../../assets/calendar-check.svg";
import Navigation from "../Navigation/Navigation";
import Ruppee from "../../assets/indian-rupee-sign.svg";
import { useAlert } from "react-alert";

const CreateDelivery = () => {
  const { showNavigation } = useSelector((state) => state.navigation);
  const dispatch = useDispatch();
  const { loading, isAuthenticated } = useSelector((state) => state.user);
  const { customers, error } = useSelector((state) => state.customers);
  const [matchedCustomer, setMatchedCustomerName] = useState("");
  const alert = useAlert();
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getCustomersIdName());
    }
    if (error) {
      alert.error(error);
    }
  }, [error]);

  const initialState = {
    customerId: "",
    deliveryDate: new Date(Date.now() + 5.5 * 60 * 60 * 1000),
    deliveredQuantity: 0,
    returnedJars: 0,
    amountReceived: 0,
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
    console.log(typeof formData.deliveryDate, formData.deliveryDate);
    const requiredFormData = Object.keys(formData).reduce((acc, key) => {
      if (formData[key] !== 0 && formData[key] !== "") {
        acc[key] = formData[key];
      }
      return acc;
    }, {});

    dispatch(createDelivery(requiredFormData));
    setFormData(initialState);
    setMatchedCustomerName("");
  };

  const renderPaymentModeDropdown = () => {
    if (formData.amountReceived > 0) {
      return (
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
      );
    }
    return null;
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
              Create Delivery
            </h2>
            <form
              onSubmit={handleDeliverySubmit}
              className="createForm deliverForm"
            >
              <div className="fields-wrapper">
                <div className="fields">
                  <label htmlFor="customerId">
                    <img src={IdLogo} alt="id" />
                    Customer Id:{" "}
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
                    Delivery Date:
                  </label>
                  <input
                    type="date"
                    name="deliveryDate"
                    placeholder="date"
                    value={formData.deliveryDate}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="fields">
                  <label htmlFor="deliveredQuantity">Delivered Jars: </label>
                  <input
                    type="number"
                    name="deliveredQuantity"
                    placeholder="delivered Jars"
                    value={formData.deliveredQuantity}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="fields">
                  <label htmlFor="returnedJars">Returned Jars: </label>
                  <input
                    type="number"
                    name="returnedJars"
                    placeholder="Returned Jars"
                    value={formData.returnedJars}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="fields">
                  <label htmlFor="amountReceived">
                    <img src={Ruppee} alt="rate" />
                    Amount Received:
                  </label>
                  <input
                    type="number"
                    name="amountReceived"
                    placeholder="Amount Received"
                    value={formData.amountReceived}
                    onChange={handleInputChange}
                  />
                </div>
                {renderPaymentModeDropdown()}
                <button className="common-cta" type="submit">
                  Create Delivery
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </>
  );
};

export default CreateDelivery;
