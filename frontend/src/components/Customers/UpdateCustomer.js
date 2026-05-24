import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import Loader from "../../components/layout/Loader/Loader.js";
import Navigation from "../Navigation/Navigation";
import {
  getFullCustomerDetails,
  getCustomersIdName,
  updateCustomer,
  clearUpdatedCustomer,
} from "../../actions/customerAction";
import Title from "../layout/Title.js";
import "./CreateCustomer.scss";
import "../Deliveries/CreateDelivery.scss";

const EMPTY_FORM = {
  name: "",
  phoneNo: "",
  address: "",
  zone: "",
  customerType: "",
  rate: "",
  allotment: "",
  frequency: "",
  nextDelivery: "",
  securityMoney: "",
  couponBalance: "",
};

const UpdateCustomer = () => {
  const { customerId: paramId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showNavigation } = useSelector((state) => state.navigation);
  const { loading, customerFullDetail, customersIdName, updateSuccess, updateError } =
    useSelector((state) => state.customers);

  // picker state (only used when no paramId)
  const [pickedId, setPickedId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCustomerName, setSelectedCustomerName] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const dropdownRef = useRef(null);

  const [formData, setFormData] = useState(EMPTY_FORM);

  const activeId = paramId || pickedId;

  // load name list only in picker mode
  useEffect(() => {
    if (!paramId) {
      dispatch(getCustomersIdName());
    }
  }, [dispatch, paramId]);

  // fetch customer when id is known
  useEffect(() => {
    if (activeId) {
      dispatch(getFullCustomerDetails(activeId));
    }
  }, [dispatch, activeId]);

  // prefill form once detail arrives
  useEffect(() => {
    if (customerFullDetail && customerFullDetail.customerId === activeId) {
      const toDateInput = (val) => {
        if (!val) return "";
        return new Date(val).toISOString().split("T")[0];
      };
      setFormData({
        name: customerFullDetail.name || "",
        phoneNo: customerFullDetail.phoneNo || "",
        address: customerFullDetail.address || "",
        zone: customerFullDetail.zone || "",
        customerType: customerFullDetail.customerType || "",
        rate: customerFullDetail.rate ?? "",
        allotment: customerFullDetail.allotment ?? "",
        frequency: customerFullDetail.frequency ?? "",
        nextDelivery: toDateInput(customerFullDetail.nextDelivery),
        securityMoney: customerFullDetail.securityMoney ?? "",
        couponBalance: customerFullDetail.couponBalance ?? "",
      });
    }
  }, [customerFullDetail, activeId]);

  useEffect(() => {
    if (updateSuccess) {
      dispatch(clearUpdatedCustomer());
      navigate("/customers");
    }
  }, [updateSuccess, dispatch, navigate]);

  // close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredCustomers = (customersIdName || []).filter((c) => {
    const q = searchQuery.toLowerCase();
    return c.name.toLowerCase().includes(q) || c.customerId.toLowerCase().includes(q);
  });

  const handleCustomerSelect = (customer) => {
    setPickedId(customer.customerId);
    setSelectedCustomerName(customer.name);
    setSearchQuery("");
    setIsDropdownOpen(false);
    setHighlightedIndex(-1);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setIsDropdownOpen(true);
    setHighlightedIndex(-1);
    if (pickedId) {
      setPickedId("");
      setSelectedCustomerName("");
      setFormData(EMPTY_FORM);
    }
  };

  const handleSearchKeyDown = (e) => {
    if (!isDropdownOpen || pickedId) return;
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
    if (name === "name") {
      const formatted = value
        .split(" ")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
      setFormData((prev) => ({ ...prev, [name]: formatted }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateCustomer(activeId, formData));
  };

  const displayValue = pickedId
    ? `${selectedCustomerName} | ${pickedId}`
    : searchQuery;

  const formReady = !!activeId && customerFullDetail?.customerId === activeId;

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <Title title={activeId ? `Edit Customer — ${activeId}` : "Edit Customer"} />
          <Navigation />
          <div className={showNavigation ? "beNeutral" : "shiftLeft"}>
            <div className="create-customer">
              {/* Customer picker — only shown in /customers/edit mode */}
              {!paramId && (
                <div className="form-section" style={{ marginBottom: "20px" }}>
                  <div className="form-section__header">Select Customer</div>
                  <div style={{ padding: "16px 20px" }}>
                    <div className="form-field" ref={dropdownRef}>
                      <label className="form-label" htmlFor="customerSearch">
                        Customer
                      </label>
                      <div className="customer-search-wrap">
                        <input
                          id="customerSearch"
                          className={`form-input customer-search-input${pickedId ? " customer-search-input--selected" : ""}`}
                          type="text"
                          placeholder="Search by name or ID…"
                          value={displayValue}
                          onChange={handleSearchChange}
                          onKeyDown={handleSearchKeyDown}
                          onFocus={() => {
                            if (!pickedId) setIsDropdownOpen(true);
                          }}
                          autoComplete="off"
                        />
                        {pickedId && (
                          <button
                            type="button"
                            className="customer-clear-btn"
                            onClick={() => {
                              setPickedId("");
                              setSelectedCustomerName("");
                              setSearchQuery("");
                              setFormData(EMPTY_FORM);
                              setIsDropdownOpen(false);
                            }}
                          >
                            ✕
                          </button>
                        )}
                        {isDropdownOpen && !pickedId && (
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
                  </div>
                </div>
              )}

              {formReady && (
                <form onSubmit={handleSubmit} className="create-customer__form">
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
                        <input
                          className="form-input"
                          id="zone"
                          name="zone"
                          value={formData.zone}
                          readOnly
                          style={{ background: "var(--color-surface-2)", color: "var(--color-text-muted)", cursor: "not-allowed" }}
                        />
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
                        <>
                          <div className="form-field">
                            <label className="form-label" htmlFor="frequency">
                              Frequency (days)
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
                          <div className="form-field">
                            <label className="form-label" htmlFor="nextDelivery">
                              Next delivery date
                            </label>
                            <input
                              className="form-input"
                              type="date"
                              id="nextDelivery"
                              name="nextDelivery"
                              value={formData.nextDelivery}
                              onChange={handleInputChange}
                            />
                          </div>
                        </>
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
                        <span style={{ fontSize: "11px", color: "var(--color-text-muted)", marginTop: "2px" }}>
                          Changing the rate only affects future deliveries. Past delivery amounts are not recalculated.
                        </span>
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
                        <label className="form-label" htmlFor="couponBalance">
                          Coupon balance
                        </label>
                        <input
                          className="form-input"
                          type="number"
                          id="couponBalance"
                          name="couponBalance"
                          placeholder="0"
                          value={formData.couponBalance}
                          onChange={handleInputChange}
                          min="0"
                        />
                      </div>
                    </div>
                  </div>

                  {updateError && (
                    <p style={{ color: "red", marginBottom: "8px" }}>{updateError}</p>
                  )}

                  <div className="form-actions">
                    <button type="submit" className="btn btn--primary">
                      Save changes
                    </button>
                    <button
                      type="button"
                      className="btn btn--secondary"
                      onClick={() => navigate("/customers")}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default UpdateCustomer;
