import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createPayment, clearNewPayment } from "../../actions/paymentAction";
import Loader from "../layout/Loader/Loader.js";
import { getCustomersIdName } from "../../actions/customerAction";
import IdLogo from "../../assets/id-badge.svg";
import CardLogo from "../../assets/credit-card.svg";
import deliveryDateLogo from "../../assets/calendar-check.svg";
import Navigation from "../Navigation/Navigation";
import { todayIST } from "../../utils/istDate";
import Ruppee from "../../assets/indian-rupee-sign.svg";
import Title from "../layout/Title";
import { IconCash } from "@tabler/icons-react";
import "./CreatePayment.scss";

const CreatePayment = () => {
  const { showNavigation } = useSelector((state) => state.navigation);
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.user);
  const { customersIdName } = useSelector((state) => state.customers);
  const { loading, error, success, newPayment } = useSelector(
    (state) => state.payments
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedCustomerName, setSelectedCustomerName] = useState("");
  const [selectedCustomerRate, setSelectedCustomerRate] = useState(null);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getCustomersIdName());
    }
    if (error) {
      console.log(error);
    }
  }, [error]);

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
    paymentDate: todayIST(),
    amount: "",
    paymentMode: "",
    paymentType: "regular",
    couponQuantity: 10,
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
    const rate = customer.rate ?? null;
    setSelectedCustomerRate(rate);
    setFormData((prev) => ({
      ...prev,
      customerId: customer.customerId,
      ...(prev.paymentType === "coupon" && rate
        ? { amount: rate * prev.couponQuantity }
        : {}),
    }));
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
      setSelectedCustomerRate(null);
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
    setFormData((prevData) => {
      const updated = { ...prevData, [name]: value };
      if (name === "couponQuantity" && prevData.paymentType === "coupon" && selectedCustomerRate) {
        updated.amount = selectedCustomerRate * Number(value);
      }
      return updated;
    });
  };

  const displayValue = formData.customerId
    ? `${selectedCustomerName} | ${formData.customerId}`
    : searchQuery;

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    dispatch(createPayment(formData));
  };

  const handleCloseModal = () => {
    dispatch(clearNewPayment());
    setFormData(initialState);
    setSelectedCustomerName("");
    setSelectedCustomerRate(null);
    setSearchQuery("");
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
            <div className="create-form-page">
              <form
                onSubmit={handlePaymentSubmit}
                className="create-form-card"
              >
                <div className="form-section">
                  <div className="form-section__header">Payment Details</div>
                  <div className="form-grid form-grid--payment">

                    {/* Customer searchable dropdown */}
                    <div className="form-field form-field--full" ref={dropdownRef}>
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
                          onBlur={() => setTimeout(() => setIsDropdownOpen(false), 150)}
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

                    {/* Payment Date */}
                    <div className="form-field">
                      <label className="form-label" htmlFor="paymentDate">
                        <img src={deliveryDateLogo} alt="date" className="field-icon" />
                        Payment date
                      </label>
                      <input
                        className="form-input"
                        type="date"
                        name="paymentDate"
                        value={formData.paymentDate}
                        onChange={handleInputChange}
                        max={todayIST()}
                      />
                    </div>

                    {/* Amount */}
                    <div className="form-field">
                      <label className="form-label" htmlFor="amount">
                        <img src={Ruppee} alt="rupee" className="field-icon" />
                        Amount received (₹)
                      </label>
                      <input
                        className="form-input"
                        type="number"
                        name="amount"
                        placeholder="0"
                        value={formData.amount}
                        onChange={handleInputChange}
                        min="1"
                        required
                      />
                      {formData.paymentType === "coupon" && selectedCustomerRate && (
                        <span style={{ fontSize: "11px", color: "#888", marginTop: "3px" }}>
                          Expected: ₹{selectedCustomerRate} × {formData.couponQuantity} = ₹{selectedCustomerRate * formData.couponQuantity}
                        </span>
                      )}
                    </div>

                    {/* Payment Type */}
                    <div className="form-field">
                      <label className="form-label">
                        <img src={CardLogo} alt="card" className="field-icon" />
                        Payment type
                      </label>
                      <select
                        className="form-select"
                        value={formData.paymentType}
                        onChange={(e) =>
                          setFormData((p) => ({
                            ...p,
                            paymentType: e.target.value,
                            paymentMode: "",
                          }))
                        }
                      >
                        <option value="regular">Regular</option>
                        <option value="coupon">Coupon Purchase</option>
                      </select>
                    </div>

                    {/* Received via (paymentMode) — always shown */}
                    <div className="form-field">
                      <label className="form-label" htmlFor="paymentMode">
                        <IconCash size={14} style={{ marginRight: "6px", verticalAlign: "middle" }} />
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

                    {/* Coupons issued — only for coupon purchase */}
                    {formData.paymentType === "coupon" && (
                      <div className="form-field">
                        <label className="form-label" htmlFor="couponQuantity">
                          Coupons issued
                        </label>
                        <input
                          className="form-input"
                          type="number"
                          name="couponQuantity"
                          value={formData.couponQuantity}
                          onChange={handleInputChange}
                          min="1"
                          required
                        />
                      </div>
                    )}

                  </div>
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn btn--primary">
                    Create Payment
                  </button>
                </div>
              </form>
            </div>
          </div>

          {newPayment && (
            <div className="modal payment-modal">
              <div className="modal-bg"></div>
              <div className="modal-text">
                {success && <h3>Payment Created Successfully</h3>}
                <div className="values">
                  <span>Name:</span> <span>{selectedCustomerName}</span>
                </div>
                <div className="values">
                  <span>Customer Id:</span> <span>{newPayment.customer}</span>
                </div>
                <div className="values">
                  <span>Payment Date:</span>{" "}
                  {new Date(newPayment.paymentDate).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    timeZone: "Asia/Kolkata",
                  })}
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
                    {formData.paymentType === "coupon" && (
                      <div className="values">
                        <span>Coupons Issued:</span>
                        <span>{formData.couponQuantity}</span>
                      </div>
                    )}
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