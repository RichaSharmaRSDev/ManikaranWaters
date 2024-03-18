import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  clearCustomerFullDetail,
  getFullCustomerDetails,
} from "../../actions/customerAction";
import CustomerFullDetails from "./CustomerFullDetails";

const CustomerTable = ({ customers }) => {
  const dispatch = useDispatch();
  const { customerFullDetail } = useSelector((state) => state.customers) || {};

  const getFullDetails = (id) => {
    dispatch(getFullCustomerDetails(id));
  };

  const handleCloseModal = () => {
    dispatch(clearCustomerFullDetail());
  };

  const formatDate = (date) => {
    if (date == null) {
      return "";
    }
    const options = { day: "2-digit", month: "short" };
    return new Intl.DateTimeFormat("en-IN", options).format(new Date(date));
  };
  return (
    <div className="customer-list">
      <table>
        <thead className="customer-list-header">
          <tr>
            <th className="customer-id">ID</th>
            <th className="customer-name">Name</th>
            <th className="customer-security">
              Customer <br /> Type
            </th>
            <th className="customer-phone">Freq</th>
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
          {customers?.map((customer) => (
            <tr
              key={customer._id}
              className={`customer-card ${
                customer.remainingAmount >= 200 || customer.extraJars >= 1
                  ? "needAttention"
                  : ""
              }`}
              onClick={() => getFullDetails(customer.customerId)}
            >
              <td className="customer-id">{customer.customerId}</td>
              <td className="customer-name">{customer.name}</td>
              <td className="customer-name">{customer.customerType}</td>
              <td className="customer-name">{customer.frequency}</td>
              <td className="customer-phone">{customer.phoneNo}</td>
              <td className="customer-rate">&#8377;{customer.rate}</td>
              <td className="customer-remaining-amount">
                &#8377;{customer.remainingAmount}
              </td>
              <td className="customer-remaining-amount">
                {customer.currentJars}
              </td>
              <td className="customer-allotment">{customer.allotment}</td>
              <td className="customer-security">
                &#8377;{customer.securityMoney}
              </td>
              <td className="customer-name">{customer.extraJars}</td>
              <td className="customer-name">
                {formatDate(customer.lastDeliveryDate)}
              </td>
              <td className="customer-name">&#8377;{customer.paidAmount}</td>
              <td className="customer-name">&#8377;{customer.billedAmount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {customerFullDetail && (
        <CustomerFullDetails
          customerFullDetail={customerFullDetail}
          handleCloseModal={handleCloseModal}
        />
      )}
    </div>
  );
};

export default CustomerTable;
