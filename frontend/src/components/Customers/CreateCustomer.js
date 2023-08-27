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
import { createNewCustomer } from "../../actions/customerAction";
import { useAlert } from "react-alert";

const CreateCustomer = () => {
  const alert = useAlert();
  const { showNavigation } = useSelector((state) => state.navigation);
  const dispatch = useDispatch();
  const { loading, success } = useSelector((state) => state.user);

  const initialState = {
    name: "",
    address: "",
    zone: "",
    phoneNo: "",
    customerType: "",
    frequency: "",
    allotment: "",
    rate: "",
  };
  const [formData, setFormData] = useState(initialState);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleCreateCustomerSubmit = (e) => {
    e.preventDefault();
    const currentJars = parseInt(formData.allotment);
    dispatch(createNewCustomer({ currentJars, ...formData }));
  };

  useEffect(() => {
    alert.success("Customer Created Succesfully");
  }, [alert, success]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
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
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                    <option value="E">E</option>
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
                    required
                  />
                </div>

                <div className="fields">
                  <label htmlFor="phoneNo">
                    <img src={Phone} alt="zone" />
                    Phone No:
                  </label>
                  <input
                    type="number"
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
                <button className="common-cta" type="submit">
                  Create Customer
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </>
  );
};

export default CreateCustomer;
