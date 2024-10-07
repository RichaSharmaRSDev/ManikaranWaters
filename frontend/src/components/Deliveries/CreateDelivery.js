import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createDelivery, clearNewDelivery } from "../../actions/deliveryAction"; // Import your delivery action
import Loader from "../../components/layout/Loader/Loader.js";
import { getCustomersIdName } from "../../actions/customerAction";
import IdLogo from "../../assets/id-badge.svg";
import Name from "../../assets/id-card-clip-alt.svg";
import CardLogo from "../../assets/credit-card.svg";
import deliveryDateLogo from "../../assets/calendar-check.svg";
import Navigation from "../Navigation/Navigation";
import Ruppee from "../../assets/indian-rupee-sign.svg";
// import { useAlert } from "react-alert";
import emptyJar from "../../assets/emptyJar.png";
import filledJar from "../../assets/filledJar.png";
import Title from "../layout/Title";
import { getAllDeliveryGuyName } from "../../actions/tripsAction";

const CreateDelivery = () => {
  const { showNavigation } = useSelector((state) => state.navigation);
  const { deliveryGuyNames } = useSelector((state) => state.trips || {});
  const dispatch = useDispatch();
  const { loading, isAuthenticated } = useSelector((state) => state.user);
  const { customersIdName, error: customerError } = useSelector(
    (state) => state.customers
  );
  const {
    newDelivery,
    error: deliveryError,
    success,
  } = useSelector((state) => state.deliveries) || {};
  const [addedCustomer, setAddedCustomer] = useState("");
  // const alert = useAlert();
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getCustomersIdName());
    }
    if (deliveryError) {
      console.log(deliveryError);
    }
  }, [deliveryError]);

  useEffect(() => {
    dispatch(getAllDeliveryGuyName());
  }, []);

  const initialState = {
    customerId: "",
    deliveryDate: new Date(Date.now() + 5.5 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    deliveredQuantity: 0,
    deliveryAssociateName: "",
    returnedJars: 0,
    amountReceived: 0,
    paymentMode: "",
    deliveryComment: "",
  };
  const [formData, setFormData] = useState(initialState);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({ ...prevData, [name]: value }));

    if (name === "customerId") {
      const addedCustomer = value;
      if (addedCustomer) {
        setAddedCustomer(addedCustomer);
      } else {
        setAddedCustomer("");
      }
    }
  };
  const handleYesterdayButton = () => {
    const yesterdayDate = new Date(
      Date.now() + 5.5 * 60 * 60 * 1000 - 24 * 60 * 60 * 1000
    );

    setFormData((prevData) => ({
      ...prevData,
      deliveryDate: yesterdayDate.toISOString().split("T")[0], // Format as "yyyy-mm-dd"
    }));
  };
  const handleDeliverySubmit = (e) => {
    e.preventDefault();
    const requiredFormData = Object.keys(formData).reduce((acc, key) => {
      if (formData[key] !== 0 && formData[key] !== "") {
        acc[key] = formData[key];
      }
      return acc;
    }, {});

    dispatch(createDelivery(requiredFormData));
  };

  const handleCloseModal = () => {
    dispatch(clearNewDelivery());
    setFormData(initialState);
    setAddedCustomer("");
  };

  const renderPaymentModeDropdown = () => {
    if (formData.amountReceived > 0) {
      return (
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
          <Title title={"Create New Entry"} />
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
                  <label htmlFor="deliveryAssociateName">
                    <img src={Name} alt="id" />
                    Associate Name:{" "}
                  </label>
                  <select
                    name="deliveryAssociateName"
                    value={formData.deliveryAssociateName}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Associate Name</option>
                    {deliveryGuyNames?.map((i) => (
                      <option value={i.name}>{i.name}</option>
                    ))}
                  </select>
                </div>
                <div className="fields">
                  <label htmlFor="customerId">
                    <img src={IdLogo} alt="id" />
                    Customer Id:{" "}
                  </label>
                  <select
                    name="customerId"
                    value={formData.customerId}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Customer</option>
                    {customersIdName?.map((customer) => (
                      <option value={customer.customerId}>
                        {customer.name}|{customer.customerId}
                      </option>
                    ))}
                  </select>
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
                    max={
                      new Date(Date.now() + 19800000)
                        .toISOString()
                        .split("T")[0]
                    }
                  />
                  <button
                    type="button"
                    className="yesterdayButton"
                    onClick={handleYesterdayButton}
                  >
                    {new Date(
                      Date.now() - 24 * 60 * 60 * 1000
                    ).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                    })}
                  </button>
                </div>
                <div className="fields">
                  <label htmlFor="deliveredQuantity">
                    <img className="large" src={filledJar} alt="date" />
                    Delivered Jars:
                  </label>
                  <input
                    type="number"
                    name="deliveredQuantity"
                    placeholder="delivered Jars"
                    value={formData.deliveredQuantity}
                    onChange={handleInputChange}
                    min="0"
                  />
                </div>
                <div className="fields">
                  <label htmlFor="returnedJars">
                    <img className="large" src={emptyJar} alt="date" />
                    Returned Jars:
                  </label>
                  <input
                    type="number"
                    name="returnedJars"
                    placeholder="Returned Jars"
                    value={formData.returnedJars}
                    onChange={handleInputChange}
                    min="0"
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
                    min="0"
                  />
                </div>
                {renderPaymentModeDropdown()}
                <div className="fields" style={{ display: "flex" }}>
                  <label htmlFor="deliveryComment">Delivery Comment:</label>
                  <textarea
                    name="deliveryComment"
                    placeholder="Delivery Comment"
                    rows={2}
                    cols={25}
                    value={formData.deliveryComment}
                    onChange={handleInputChange}
                  ></textarea>
                </div>
                <button className="common-cta" type="submit">
                  Create Delivery
                </button>
              </div>
            </form>
          </div>
          {newDelivery && (
            <div className="modal delivery-modal">
              <div className="modal-bg"></div>
              <div className="modal-text">
                {success && <h3>Delivery Created Successfully</h3>}
                <div className="values">
                  <span>Associate Name:</span>{" "}
                  <span>{newDelivery.deliveryAssociateName}</span>
                </div>
                <div className="values">
                  <span>Customer Name:</span>{" "}
                  <span>
                    {customersIdName
                      .filter((i) => addedCustomer == i.customerId)
                      .map((customer) => customer.name)}
                  </span>
                </div>
                <div className="values">
                  <span>Customer Id:</span> <span>{newDelivery.customer}</span>
                </div>
                <div className="values">
                  <span>Delivery Date:</span>{" "}
                  <span>
                    {new Date(newDelivery.deliveryDate).toLocaleDateString(
                      "en-GB",
                      { day: "2-digit", month: "short" }
                    )}
                  </span>
                </div>
                {newDelivery.deliveredQuantity && (
                  <div className="values">
                    <span>Delivered Jars:</span>{" "}
                    <span>{newDelivery.deliveredQuantity}</span>
                  </div>
                )}
                {newDelivery.returnedJars && (
                  <div className="values">
                    <span>Returned Jars:</span>{" "}
                    <span>{newDelivery.returnedJars}</span>
                  </div>
                )}
                {newDelivery.amountReceived && (
                  <>
                    <div className="values">
                      <span>Amount Received:</span>{" "}
                      <span>{newDelivery.amountReceived}</span>
                    </div>
                    <div className="values">
                      <span>Payment Mode:</span>{" "}
                      <span>{newDelivery.paymentMode}</span>
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

export default CreateDelivery;
