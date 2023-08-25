import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { clearErrors, getCustomers } from "../../actions/customerAction";
import Loader from "../layout/Loader/Loader";
import { Navigate } from "react-router-dom";
import Navigation from "../Navigation/Navigation";

const Customers = () => {
  const dispatch = useDispatch();
  const { customers, loading, error } = useSelector((state) => state.customers);
  const { isAuthenticated } = useSelector((state) => state.user);
  const { showNavigation } = useSelector((state) => state.navigation);
  useEffect(() => {
    if (error) {
      dispatch(clearErrors());
    }
    if (isAuthenticated === false) {
      Navigate("/");
    }
    dispatch(getCustomers());
  }, [dispatch, error, isAuthenticated]);

  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const handleCustomerClick = (customerId) => {
    if (selectedCustomer === customerId) {
      setSelectedCustomer(null);
    } else {
      setSelectedCustomer(customerId);
    }
  };
  const renderDeliveries = (deliveries) => (
    <div className="deliveries-list">
      <h3>Deliveries:</h3>
      {deliveries.map((delivery) => (
        <div key={delivery._id} className="delivery-item">
          <span className="delivery-date">
            Delivery Date: {delivery.deliveryDate}
          </span>
          <span className="delivered-quantity">
            Delivered Quantity: {delivery.deliveredQuantity}
          </span>
        </div>
      ))}
    </div>
  );
  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div>
          <Navigation />
          <div className={showNavigation ? "beNeutral" : "shiftLeft"}>
            <div className="customer-list">
              <div className="customer-header">
                <span className="customer-id">customerId</span>
                <span className="customer-zone">Zone</span>
                <span className="customer-name">Name</span>
                <span className="customer-phone">phoneNo</span>
                <span className="customer-remaining-amount">
                  remainingAmount
                </span>
                <span className="header-item">Deliveries</span>
              </div>
              {customers.map((customer) => (
                <div key={customer._id} className="customer-card">
                  <span className="customer-id">{customer.customerId}</span>
                  <span className="customer-zone">{customer.zone}</span>
                  <span className="customer-name">{customer.name}</span>
                  <span className="customer-phone">{customer.phoneNo}</span>
                  <span className="customer-remaining-amount">
                    Remaining Amount: {customer.remainingAmount}
                  </span>
                  <button
                    className="customer-tab-button"
                    onClick={() => handleCustomerClick(customer.customerId)}
                  >
                    {selectedCustomer === customer.customerId ? "Hide" : "Show"}{" "}
                    Deliveries
                  </button>

                  {selectedCustomer === customer.customerId &&
                    renderDeliveries(customer.deliveries)}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Customers;
