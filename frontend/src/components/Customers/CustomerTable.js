import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { IconPencil } from "@tabler/icons-react";
import {
  getCustomerDeliveriesHistory,
  clearCustomerDeliveriesHistory,
} from "../../actions/customerAction";
import CustomerFullDetails from "./CustomerFullDetails";

const CustomerTable = ({ customers }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { customerDeliveriesHistory } =
    useSelector((state) => state.customers) || {};

  const getDeliveriesHistory = (id) => {
    dispatch(getCustomerDeliveriesHistory(id));
  };

  const handleCloseModal = () => {
    dispatch(clearCustomerDeliveriesHistory());
  };

  const formatDate = (date) => {
    if (date == null) {
      return "";
    }
    const options = { day: "2-digit", month: "short", timeZone: "Asia/Kolkata" };
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
            <th className="customer-security">
              Coupon
              <br />
              Balance
            </th>
            <th className="customer-edit"></th>
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
              onClick={() => getDeliveriesHistory(customer.customerId)}
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
              <td className="customer-coupon">
                {customer.couponBalance != null ? (
                  <span className={customer.couponBalance <= customer.allotment ? "needAttention" : ""}>
                    {customer.couponBalance}
                  </span>
                ) : (
                  <span>—</span>
                )}
              </td>
              <td
                className="customer-edit"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => navigate(`/customer/edit/${customer.customerId}`)}
                  style={{ background: "none", border: "none", padding: 0, cursor: "pointer", display: "flex", alignItems: "center" }}
                >
                  <IconPencil size={14} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {customerDeliveriesHistory && (
        <CustomerFullDetails
          customerDeliveriesHistory={customerDeliveriesHistory}
          handleCloseModal={handleCloseModal}
        />
      )}
    </div>
  );
};

export default CustomerTable;
