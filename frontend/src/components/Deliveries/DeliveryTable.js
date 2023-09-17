import React from "react";

const DeliveryTable = ({ deliveries, deliveryTotal }) => {
  const formatDate = (date) => {
    if (date == null) {
      return "";
    }
    const options = { day: "2-digit", month: "short" };
    return new Intl.DateTimeFormat("en-IN", options).format(new Date(date));
  };
  const calcDiff = (diff) => {
    if (diff == 0) {
      return (
        <span className="success">
          No difference. We collected equal quantity.
        </span>
      );
    } else if (diff > 1) {
      return (
        <span className="error">
          We delivered {diff} more cans than what we received.
        </span>
      );
    } else {
      return (
        <span className="success">
          We received {-diff} more cans than what we delivered.
        </span>
      );
    }
  };
  return (
    <div className="delivery-list">
      <table>
        <thead className="delivery-list-header">
          <tr>
            <th className="delivery-id">ID</th>
            <th className="delivery-name">Name</th>
            <th className="delivery-security">Delivery Date</th>
            <th className="delivery-security">Delivered By</th>
            <th className="delivery-security">Delivered Jars</th>
            <th className="delivery-security">Returned Jars</th>
            <th className="delivery-security">Amount Paid</th>
          </tr>
        </thead>
        <tbody>
          {deliveries?.map((delivery) => (
            <tr key={delivery._id} className="delivery-card">
              <td className="delivery-id">{delivery.customerId}</td>
              <td className="delivery-zone">{delivery.customerName}</td>
              <td className="delivery-name">
                {formatDate(delivery.deliveryDate)}
              </td>
              <td>{delivery.deliveryAssociateName}</td>
              <td className="delivery-name">
                {delivery.deliveredQuantity || 0}
              </td>
              <td className="delivery-phone">{delivery.returnedJars || 0}</td>
              <td className="delivery-rate">
                &#8377;{delivery.amountReceived || 0}
                {delivery.amountReceived > 0
                  ? ` - ${delivery.paymentMode}`
                  : ""}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td className="finalTotal">Total Delivered Quantity: </td>
            <td className="finalTotal">{deliveryTotal?.totalDeliveredJars}</td>
          </tr>
          <tr>
            <td className="finalTotal">Total Received Quantity: </td>
            <td className="finalTotal">{deliveryTotal?.totalReturnedJars}</td>
          </tr>
          <tr>
            <td className="finalTotal">Diff in Quantity: </td>
            <td className="finalTotal">{calcDiff(deliveryTotal?.diff)}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default DeliveryTable;
