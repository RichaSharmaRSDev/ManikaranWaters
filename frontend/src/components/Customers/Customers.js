import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  clearErrors,
  getAllCustomersBasicDetails,
} from "../../actions/customerAction";
import Loader from "../layout/Loader/Loader";
import { Navigate } from "react-router-dom";
import Navigation from "../Navigation/Navigation";
import { useAlert } from "react-alert";
import "./Customers.scss";

const Customers = () => {
  const dispatch = useDispatch();
  const { customers, loading, error, successIdName } = useSelector(
    (state) => state.customers
  );
  const { isAuthenticated } = useSelector((state) => state.user);
  const { showNavigation } = useSelector((state) => state.navigation);
  const alert = useAlert();
  useEffect(() => {
    if (successIdName) {
      alert.success("Reterived data successfully.");
    }
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    if (isAuthenticated === false) {
      Navigate("/");
    }
    dispatch(getAllCustomersBasicDetails());
  }, [error, isAuthenticated, dispatch]);

  const formatDate = (date) => {
    const options = { day: "2-digit", month: "short" };
    return new Intl.DateTimeFormat("en-IN", options).format(new Date(date));
  };
  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div>
          <Navigation />
          <div className={showNavigation ? "beNeutral" : "shiftLeft"}>
            <h2 className="common-heading">Customers List</h2>
            <div className="customer-list">
              <table>
                <thead className="customer-list-header">
                  <tr>
                    <th className="customer-id">ID</th>
                    <th className="customer-zone">Zone</th>
                    <th className="customer-name">Name</th>
                    <th className="customer-security">
                      Customer <br /> Type
                    </th>
                    <th className="customer-phone">Phone No</th>
                    <th className="customer-allotment">Rate</th>
                    <th className="customer-remaining-amount">
                      Remaining
                      <br /> Amount
                    </th>
                    <th className="customer-remaining-amount">
                      Current
                      <br /> Jars
                    </th>
                    <th className="customer-allotment">Allot.</th>
                    <th className="customer-security">
                      Security
                      <br />
                      Amount
                    </th>
                    <th className="customer-security">
                      Extra
                      <br />
                      Jars
                    </th>
                    <th className="customer-security">
                      Last
                      <br />
                      Delivery
                    </th>
                    <th className="customer-security">
                      Paid
                      <br />
                      Amount
                    </th>
                    <th className="customer-security">
                      Billed
                      <br />
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((customer) => (
                    <tr key={customer._id} className="customer-card">
                      <td className="customer-id">{customer.customerId}</td>
                      <td className="customer-zone">{customer.zone}</td>
                      <td className="customer-name">{customer.name}</td>
                      <td className="customer-name">{customer.customerType}</td>
                      <td className="customer-phone">{customer.phoneNo}</td>
                      <td className="customer-rate">&#8377;{customer.rate}</td>
                      <td className="customer-remaining-amount">
                        &#8377;{customer.remainingAmount}
                      </td>
                      <td className="customer-remaining-amount">
                        {customer.currentJars}
                      </td>
                      <td className="customer-allotment">
                        {customer.allotment}
                      </td>
                      <td className="customer-security">
                        &#8377;{customer.security}
                      </td>
                      <td className="customer-name">{customer.extraJars}</td>
                      <td className="customer-name">
                        {formatDate(customer.lastDeliveryDate)}
                      </td>
                      <td className="customer-name">{customer.amountPaid}</td>
                      <td className="customer-name">{customer.billedAmount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Customers;
