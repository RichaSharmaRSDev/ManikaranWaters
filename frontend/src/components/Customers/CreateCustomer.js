import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../components/layout/Loader/Loader.js";
import Marker from "../../assets/marker.svg";
import Allotment from "../../assets/user-unlock.svg";
import Name from "../../assets/id-card-clip-alt.svg";
import Phone from "../../assets/circle-phone-flip.svg";
import Zone from "../../assets/map.svg";
import Ruppee from "../../assets/indian-rupee-sign.svg";
import Type from "../../assets/rectangle-list.svg";
import Navigation from "../Navigation/Navigation";
import {
  createNewCustomer,
  clearNewCustomer,
} from "../../actions/customerAction";
// // import { useAlert } from "react-alert";
import Title from "../layout/Title.js";

const CreateCustomer = () => {
  // // const alert = useAlert();
  const { showNavigation } = useSelector((state) => state.navigation);
  const dispatch = useDispatch();
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
    setFormData((prevData) => ({ ...prevData, [name]: value }));
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
            <h2 className="common-heading common-heading-form">
              Create New Customer
            </h2>
            <form
              onSubmit={handleCreateCustomerSubmit}
              className="createForm createCustomerForm"
            >
              <div className="fields-wrapper">
                <div className="fields">
                  <label htmlFor="name">
                    <img src={Name} alt="zone" />
                    Name:
                  </label>
                  <input
                    required
                    type="string"
                    name="name"
                    placeholder="Customer Name"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="fields">
                  <label htmlFor="zone">
                    <img src={Zone} alt="zone" />
                    Zone:
                  </label>
                  <select
                    name="zone"
                    value={formData.zone}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Customer Zone</option>
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
                  </select>
                </div>

                <div className="fields">
                  <label htmlFor="customerType">
                    <img src={Type} alt="customerType" />
                    Customer Type:
                  </label>
                  <select
                    name="customerType"
                    value={formData.customerType}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Customer Type</option>
                    <option value="on demand">On Demand</option>
                    <option value="subscription">Subscription</option>
                  </select>
                </div>
                {formData.customerType === "subscription" && (
                  <div className="fields">
                    <label htmlFor="frequency">
                      <img src={Name} alt="zone" />
                      Frequency:
                    </label>
                    <input
                      required
                      type="number"
                      name="frequency"
                      placeholder="Frequency"
                      value={formData.frequency}
                      onChange={handleInputChange}
                      min="1"
                    />
                  </div>
                )}

                <div className="fields">
                  <label htmlFor="rate">
                    <img src={Ruppee} alt="rate" />
                    Rate:
                  </label>
                  <input
                    type="number"
                    name="rate"
                    placeholder="Rate"
                    value={formData.rate}
                    onChange={handleInputChange}
                    min="1"
                    required
                  />
                </div>

                <div className="fields">
                  <label htmlFor="phoneNo">
                    <img src={Phone} alt="zone" />
                    Phone No:
                  </label>
                  <input
                    type="tel"
                    name="phoneNo"
                    placeholder="Phone No"
                    value={formData.phoneNo}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="fields">
                  <label htmlFor="allotment">
                    <img src={Allotment} alt="zone" />
                    Allotment:
                  </label>
                  <input
                    type="number"
                    name="allotment"
                    placeholder="Allotment of Jars"
                    value={formData.allotment}
                    onChange={handleInputChange}
                    min="0"
                    required
                  />
                </div>
                <div className="fields">
                  <label htmlFor="securityMoney">
                    <img src={Allotment} alt="zone" />
                    Security Money:
                  </label>
                  <input
                    type="number"
                    name="securityMoney"
                    placeholder="Security Money"
                    value={formData.securityMoney}
                    onChange={handleInputChange}
                    min="0"
                    required
                  />
                </div>

                <div className="fields">
                  <label htmlFor="address">
                    <img src={Marker} alt="zone" />
                    Address:
                  </label>
                  <input
                    type="string"
                    name="address"
                    placeholder="Address"
                    value={formData.address}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="fields">
                  <label htmlFor="billedAmount">
                    <img src={Ruppee} alt="billedAmount" />
                    Billed Amount:
                  </label>
                  <input
                    type="number"
                    name="billedAmount"
                    placeholder="Billed Amount"
                    value={formData.billedAmount}
                    onChange={handleInputChange}
                  />
                </div>
                <button className="common-cta" type="submit">
                  Create Customer
                </button>
              </div>
            </form>
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
                  <span>CustomerId:</span> <span>{newCustomer.customerId}</span>
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
