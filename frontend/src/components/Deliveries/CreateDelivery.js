import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createDelivery, clearNewDelivery } from "../../actions/deliveryAction";
import Loader from "../../components/layout/Loader/Loader.js";
import { getCustomersIdName } from "../../actions/customerAction";
import IdLogo from "../../assets/id-badge.svg";
import Name from "../../assets/id-card-clip-alt.svg";
import CardLogo from "../../assets/credit-card.svg";
import deliveryDateLogo from "../../assets/calendar-check.svg";
import Navigation from "../Navigation/Navigation";
import { todayIST, yesterdayIST } from "../../utils/istDate";
import Ruppee from "../../assets/indian-rupee-sign.svg";
import emptyJar from "../../assets/emptyJar.png";
import filledJar from "../../assets/filledJar.png";
import Title from "../layout/Title";
import { getAllDeliveryGuyName } from "../../actions/tripsAction";
import "./CreateDelivery.scss";

const CreateDelivery = () => {
  const { showNavigation } = useSelector((state) => state.navigation);
  const { deliveryGuyNames } = useSelector((state) => state.trips || {});
  const dispatch = useDispatch();
  const { loading, isAuthenticated } = useSelector((state) => state.user);
  const { customersIdName } = useSelector((state) => state.customers);
  const {
    newDelivery,
    error: deliveryError,
    success,
  } = useSelector((state) => state.deliveries) || {};

  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedCustomerName, setSelectedCustomerName] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const dropdownRef = useRef(null);

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

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const initialState = {
    customerId: "",
    deliveryDate: todayIST(),
    deliveredQuantity: "",
    deliveryAssociateName: "",
    returnedJars: "",
    amountReceived: "",
    paymentMode: "",
    deliveryComment: "",
  };
  const [formData, setFormData] = useState(initialState);

  const filteredCustomers = (customersIdName || []).filter((c) => {
    const q = searchQuery.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.customerId.toLowerCase().includes(q)
    );
  });

  const handleCustomerSelect = (customer) => {
    setFormData((prev) => ({ ...prev, customerId: customer.customerId }));
    setSelectedCustomerName(customer.name);
    setSearchQuery("");
    setIsDropdownOpen(false);
    setHighlightedIndex(-1);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setIsDropdownOpen(true);
    setHighlightedIndex(-1);
    if (formData.customerId) {
      setFormData((prev) => ({ ...prev, customerId: "" }));
      setSelectedCustomerName("");
    }
  };

  const handleSearchKeyDown = (e) => {
    if (!isDropdownOpen || formData.customerId) return;
    const items = filteredCustomers.slice(0, 8);
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((i) => Math.min(i + 1, items.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && highlightedIndex >= 0) {
      e.preventDefault();
      handleCustomerSelect(items[highlightedIndex]);
    } else if (e.key === "Escape" || e.key === "Tab") {
      setIsDropdownOpen(false);
      setHighlightedIndex(-1);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleYesterdayButton = () => {
    setFormData((prevData) => ({
      ...prevData,
      deliveryDate: yesterdayIST(),
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
    setSelectedCustomerName("");
    setSearchQuery("");
  };

  const displayValue = formData.customerId
    ? `${selectedCustomerName} | ${formData.customerId}`
    : searchQuery;

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <Title title={"Create New Entry"} />
          <Navigation />
          <div className={showNavigation ? "beNeutral" : "shiftLeft"}>
            <div className="create-form-page">
              <form
                onSubmit={handleDeliverySubmit}
                className="create-form-card"
              >
                {/* Section: Associate & Customer */}
                <div className="form-section">
                  <div className="form-section__header">Delivery Details</div>
                  <div className="form-grid form-grid--delivery">

                    {/* Customer searchable dropdown */}
                    <div className="form-field" ref={dropdownRef}>
                      <label className="form-label" htmlFor="customerSearch">
                        <img src={IdLogo} alt="customer" className="field-icon" />
                        Customer
                      </label>
                      <div className="customer-search-wrap">
                        <input
                          id="customerSearch"
                          className={`form-input customer-search-input ${formData.customerId ? "customer-search-input--selected" : ""}`}
                          type="text"
                          placeholder="Search by name or ID…"
                          value={displayValue}
                          onChange={handleSearchChange}
                          onKeyDown={handleSearchKeyDown}
                          onFocus={() => {
                            if (!formData.customerId) setIsDropdownOpen(true);
                          }}
                          autoComplete="off"
                          required={!formData.customerId}
                        />
                        {formData.customerId && (
                          <button
                            type="button"
                            className="customer-clear-btn"
                            onClick={() => {
                              setFormData((prev) => ({ ...prev, customerId: "" }));
                              setSelectedCustomerName("");
                              setSearchQuery("");
                              setIsDropdownOpen(false);
                            }}
                          >
                            ✕
                          </button>
                        )}
                        {/* Hidden input to enforce required for formData.customerId */}
                        <input
                          type="text"
                          value={formData.customerId}
                          onChange={() => {}}
                          required
                          style={{ position: "absolute", opacity: 0, width: 0, height: 0, pointerEvents: "none" }}
                          tabIndex={-1}
                        />
                        {isDropdownOpen && !formData.customerId && (
                          <div className="customer-dropdown">
                            {filteredCustomers.length > 0 ? (
                              filteredCustomers.slice(0, 8).map((customer, idx) => (
                                <div
                                  key={customer.customerId}
                                  className={`customer-dropdown__item${idx === highlightedIndex ? " customer-dropdown__item--highlighted" : ""}`}
                                  onMouseDown={() => handleCustomerSelect(customer)}
                                >
                                  <span className="customer-dropdown__name">{customer.name}</span>
                                  <span className="customer-dropdown__id">{customer.customerId}</span>
                                </div>
                              ))
                            ) : (
                              <div className="customer-dropdown__empty">No customers found</div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Associate */}
                    <div className="form-field">
                      <label className="form-label" htmlFor="deliveryAssociateName">
                        <img src={Name} alt="associate" className="field-icon" />
                        Associate name
                      </label>
                      <select
                        className="form-select"
                        name="deliveryAssociateName"
                        value={formData.deliveryAssociateName}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select associate…</option>
                        {deliveryGuyNames?.map((i) => (
                          <option key={i.name} value={i.name}>{i.name}</option>
                        ))}
                      </select>
                    </div>

                    {/* Delivery Date */}
                    <div className="form-field">
                      <label className="form-label" htmlFor="deliveryDate">
                        <img src={deliveryDateLogo} alt="date" className="field-icon" />
                        Delivery date
                      </label>
                      <div className="date-field-wrap">
                        <input
                          className="form-input"
                          type="date"
                          name="deliveryDate"
                          value={formData.deliveryDate}
                          onChange={handleInputChange}
                          max={todayIST()}
                        />
                        <button
                          type="button"
                          className="yesterday-btn"
                          onClick={handleYesterdayButton}
                        >
                          {new Date(
                            Date.now() - 24 * 60 * 60 * 1000
                          ).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            timeZone: "Asia/Kolkata",
                          })}
                        </button>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Section: Jars & Payment */}
                <div className="form-section">
                  <div className="form-section__header">Jars &amp; Payment</div>
                  <div className="form-grid form-grid--delivery">

                    <div className="form-field">
                      <label className="form-label" htmlFor="deliveredQuantity">
                        <img className="field-icon" src={filledJar} alt="filled jar" />
                        Delivered jars
                      </label>
                      <input
                        className="form-input"
                        type="number"
                        name="deliveredQuantity"
                        placeholder="0"
                        value={formData.deliveredQuantity}
                        onChange={handleInputChange}
                        min="0"
                      />
                    </div>

                    <div className="form-field">
                      <label className="form-label" htmlFor="returnedJars">
                        <img className="field-icon" src={emptyJar} alt="empty jar" />
                        Returned jars
                      </label>
                      <input
                        className="form-input"
                        type="number"
                        name="returnedJars"
                        placeholder="0"
                        value={formData.returnedJars}
                        onChange={handleInputChange}
                        min="0"
                      />
                    </div>

                    <div className="form-field">
                      <label className="form-label" htmlFor="amountReceived">
                        <img src={Ruppee} alt="rupee" className="field-icon" />
                        Amount received (₹)
                      </label>
                      <input
                        className="form-input"
                        type="number"
                        name="amountReceived"
                        placeholder="0"
                        value={formData.amountReceived}
                        onChange={handleInputChange}
                        min="0"
                      />
                    </div>

                    {formData.amountReceived > 0 && (
                      <div className="form-field">
                        <label className="form-label" htmlFor="paymentMode">
                          <img src={CardLogo} alt="card" className="field-icon" />
                          Payment mode
                        </label>
                        <select
                          className="form-select"
                          name="paymentMode"
                          value={formData.paymentMode}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="">Select mode…</option>
                          <option value="cash">Cash</option>
                          <option value="online">Online</option>
                        </select>
                      </div>
                    )}

                    <div className="form-field form-field--full">
                      <label className="form-label" htmlFor="deliveryComment">
                        Delivery comment
                      </label>
                      <textarea
                        className="form-input form-textarea"
                        name="deliveryComment"
                        placeholder="Optional note…"
                        rows={2}
                        value={formData.deliveryComment}
                        onChange={handleInputChange}
                      />
                    </div>

                  </div>
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn btn--primary">
                    Create Delivery
                  </button>
                </div>
              </form>
            </div>
          </div>

          {newDelivery && (
            <div className="modal delivery-modal">
              <div className="modal-bg"></div>
              <div className="modal-text">
                {success && <h3>Delivery Created Successfully</h3>}
                <div className="values">
                  <span>Associate:</span>
                  <span>{newDelivery.deliveryAssociateName}</span>
                </div>
                <div className="values">
                  <span>Customer:</span>
                  <span>{selectedCustomerName}</span>
                </div>
                <div className="values">
                  <span>Customer Id:</span>
                  <span>{newDelivery.customer}</span>
                </div>
                <div className="values">
                  <span>Delivery Date:</span>
                  <span>
                    {new Date(newDelivery.deliveryDate).toLocaleDateString(
                      "en-GB",
                      { day: "2-digit", month: "short", timeZone: "Asia/Kolkata" }
                    )}
                  </span>
                </div>
                {newDelivery.deliveredQuantity && (
                  <div className="values">
                    <span>Delivered Jars:</span>
                    <span>{newDelivery.deliveredQuantity}</span>
                  </div>
                )}
                {newDelivery.returnedJars && (
                  <div className="values">
                    <span>Returned Jars:</span>
                    <span>{newDelivery.returnedJars}</span>
                  </div>
                )}
                {newDelivery.amountReceived && (
                  <>
                    <div className="values">
                      <span>Amount Received:</span>
                      <span>{newDelivery.amountReceived}</span>
                    </div>
                    <div className="values">
                      <span>Payment Mode:</span>
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