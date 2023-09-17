import React from "react";

const HabitsCustomerTable = ({ customers, frequencyField = true }) => {
  console.log({ frequencyField });
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
              Last
              <br />
              Delivery
            </th>
            {frequencyField && <th className="customer-security">Freq.</th>}
            <th className="customer-remaining-amount">
              Next
              <br /> Delivery
            </th>
            <th className="customer-phone">Phone No</th>
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
              Extra
              <br />
              Jars
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
            <tr key={customer._id} className="customer-card">
              <td className="customer-id">{customer.customerId}</td>
              <td className="customer-name">{customer.name}</td>
              <td className="customer-name">
                {formatDate(customer.lastDeliveryDate)}
              </td>
              {frequencyField && (
                <td className="customer-name">{customer.frequency}</td>
              )}
              <td className="customer-name">
                {formatDate(customer.nextDelivery)}
              </td>
              <td className="customer-phone">{customer.phoneNo}</td>
              <td className="customer-remaining-amount">
                &#8377;{customer.remainingAmount}
              </td>
              <td className="customer-remaining-amount">
                {customer.currentJars}
              </td>
              <td className="customer-allotment">{customer.allotment}</td>
              <td className="customer-name">{customer.extraJars}</td>
              <td className="customer-name">&#8377;{customer.paidAmount}</td>
              <td className="customer-name">&#8377;{customer.billedAmount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HabitsCustomerTable;
