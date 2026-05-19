import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/layout/Loader/Loader.js";
import Navigation from "../Navigation/Navigation";
import {
  createNewCustomer,
  clearNewCustomer,
} from "../../actions/customerAction";
import Title from "../layout/Title.js";
import "./CreateCustomer.scss";

const CreateCustomer = () => {
  const { showNavigation } = useSelector((state) => state.navigation);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, successCreate, newCustomer, newCustomerError } = useSelector(
    (state) => state.customers
  );

  const initialState = {
    name: "",
    address: "",
    zone: "",
    phoneNo: "",
    customerType: "",
    frequency: "",
    allotment: "",
    securityMoney: "",
    rate: "",
    billedAmount: 0,
  };
  const [formData, setFormData] = useState(initialState);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "name") {
      const formattedValue = value
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
      setFormData((prevData) => ({ ...prevData, [name]: formattedValue }));
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const handleCreateCustomerSubmit = (e) => {
    e.preventDefault();
    dispatch(createNewCustomer(formData));
    setFormData(initialState);
  };

  const handleCloseModal = () => {
    dispatch(clearNewCustomer());
    setFormData(initialState);
  };

  useEffect(() => {
    if (newCustomerError) {
      console.log(newCustomerError);
    }
  }, [newCustomerError]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <Title title={"Create New Customer"} />
          <Navigation />
          <div className={showNavigation ? "beNeutral" : "shiftLeft"}>
            <div className="create-customer">
              <form
                onSubmit={handleCreateCustomerSubmit}
                className="create-customer__form"
              >
                <div className="form-section">
                  <div className="form-section__header">Basic Information</div>
                  <div className="form-grid">
                    <div className="form-field">
                      <label className="form-label" htmlFor="name">
                        Customer name
                      </label>
                      <input
                        className="form-input"
                        required
                        type="text"
                        id="name"
                        name="name"
                        placeholder="Full name"
                        value={formData.name}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="form-field">
                      <label className="form-label" htmlFor="phoneNo">
                        Phone number
                      </label>
                      <input
                        className="form-input"
                        type="tel"
                        id="phoneNo"
                        name="phoneNo"
                        placeholder="10-digit mobile"
                        value={formData.phoneNo}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="form-field">
                      <label className="form-label" htmlFor="zone">
                        Zone
                      </label>
                      <select
                        className="form-select"
                        id="zone"
                        name="zone"
                        value={formData.zone}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select zone...</option>
                        <option value="AA">AA</option>
                        <option value="AB">AB</option>
                        <option value="AC">AC</option>
                        <option value="BA">BA</option>
                        <option value="BB">BB</option>
                        <option value="BC">BC</option>
                        <option value="C">C</option>
                        <option value="D">D</option>
                        <option value="EA">EA</option>
                        <option value="EB">EB</option>
                        <option value="EC">EC</option>
                        <option value="F">F</option>
                      </select>
                    </div>
                    <div className="form-field">
                      <label className="form-label" htmlFor="customerType">
                        Customer type
                      </label>
                      <select
                        className="form-select"
                        id="customerType"
                        name="customerType"
                        value={formData.customerType}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select type...</option>
                        <option value="on demand">On Demand</option>
                        <option value="subscription">Subscription</option>
                      </select>
                    </div>
                    {formData.customerType === "subscription" && (
                      <div className="form-field">
                        <label className="form-label" htmlFor="frequency">
                          Frequency
                        </label>
                        <input
                          className="form-input"
                          required
                          type="number"
                          id="frequency"
                          name="frequency"
                          placeholder="Delivery frequency"
                          value={formData.frequency}
                          onChange={handleInputChange}
                          min="1"
                        />
                      </div>
                    )}
                    <div className="form-field form-field--full">
                      <label className="form-label" htmlFor="address">
                        Address
                      </label>
                      <input
                        className="form-input"
                        type="text"
                        id="address"
                        name="address"
                        placeholder="Full delivery address"
                        value={formData.address}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>

                <div className="form-section">
                  <div className="form-section__header">Jar &amp; Billing</div>
                  <div className="form-grid">
                    <div className="form-field">
                      <label className="form-label" htmlFor="rate">
                        Rate per jar (₹)
                      </label>
                      <input
                        className="form-input"
                        type="number"
                        id="rate"
                        name="rate"
                        placeholder="0"
                        value={formData.rate}
                        onChange={handleInputChange}
                        min="1"
                        required
                      />
                    </div>
                    <div className="form-field">
                      <label className="form-label" htmlFor="allotment">
                        Jar allotment
                      </label>
                      <input
                        className="form-input"
                        type="number"
                        id="allotment"
                        name="allotment"
                        placeholder="0"
                        value={formData.allotment}
                        onChange={handleInputChange}
                        min="0"
                        required
                      />
                    </div>
                    <div className="form-field">
                      <label className="form-label" htmlFor="securityMoney">
                        Security deposit (₹)
                      </label>
                      <input
                        className="form-input"
                        type="number"
                        id="securityMoney"
                        name="securityMoney"
                        placeholder="0"
                        value={formData.securityMoney}
                        onChange={handleInputChange}
                        min="0"
                        required
                      />
                    </div>
                    <div className="form-field">
                      <label className="form-label" htmlFor="billedAmount">
                        Outstanding amount (₹)
                      </label>
                      <input
                        className="form-input"
                        type="number"
                        id="billedAmount"
                        name="billedAmount"
                        placeholder="0"
                        value={formData.billedAmount}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn btn--primary">
                    Create customer
                  </button>
                  <button
                    type="button"
                    className="btn btn--secondary"
                    onClick={() => navigate(-1)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>

          {newCustomer && (
            <div className="modal create-customer-modal">
              <div className="modal-bg"></div>
              <div className="modal-text">
                {successCreate && <h3>Customer Created Successfully</h3>}
                <div className="values">
                  <span>Name:</span> <span>{newCustomer.name}</span>
                </div>
                <div className="values">
                  <span>CustomerId:</span>{" "}
                  <span>{newCustomer.customerId}</span>
                </div>
                <div className="values">
                  <span>Zone:</span> <span>{newCustomer.zone}</span>
                </div>
                <div className="values">
                  <span>Rate:</span> <span>₹{newCustomer.rate}</span>
                </div>
                <div className="values">
                  <span>Phone No:</span> <span>{newCustomer.phoneNo}</span>
                </div>
                <div className="values">
                  <span>Allotment:</span> <span>{newCustomer.allotment}</span>
                </div>
                <div className="values">
                  <span>Security Money:</span>{" "}
                  <span>₹{newCustomer.securityMoney}</span>
                </div>
                <div className="values">
                  <span>Customer Type:</span>{" "}
                  <span>{newCustomer.customerType}</span>
                </div>
                {newCustomer.customerType === "subscription" && (
                  <div className="values">
                    <span>Frequency:</span> <span>{newCustomer.frequency}</span>
                  </div>
                )}
                <div className="values">
                  <span>Address:</span> <span>{newCustomer.address}</span>
                </div>
                <div className="values">
                  <span>Billed Amount:</span>{" "}
                  <span>₹{newCustomer.billedAmount}</span>
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

export default CreateCustomer;
