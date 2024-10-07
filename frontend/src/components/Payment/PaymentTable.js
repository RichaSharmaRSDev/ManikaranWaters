import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deletePayment } from "../../actions/paymentAction";

const PaymentTable = ({ payments, paymentTotal, onRefresh }) => {
  const dispatch = useDispatch();
  const { deletePaymentSuccess } =
    useSelector((state) => state.deliveries) || {};
  const handleDelete = async (paymentId, customerId) => {
    dispatch(deletePayment(paymentId, customerId));
  };
  const formatDate = (date) => {
    if (date == null) {
      return "";
    }
    const options = { day: "2-digit", month: "short" };
    return new Intl.DateTimeFormat("en-IN", options).format(new Date(date));
  };
  useEffect(() => {
    if (deletePaymentSuccess) {
      onRefresh(); // Call the onRefresh function to fetch payments again
    }
  }, [deletePaymentSuccess, onRefresh]);
  return (
    <div className="payment-list">
      <table>
        <thead className="payment-list-header">
          <tr>
            <th>Sl No.</th>
            <th className="payment-id">ID</th>
            <th className="payment-name">Name</th>
            <th className="payment-security">Payment Date</th>
            <th className="payment-security">Amount Paid</th>
            <th className="payment-security">Payment Mode</th>
            <th className="payment-security">Delete</th>
          </tr>
        </thead>
        <tbody>
          {payments?.map((payment, index) => (
            <tr key={payment._id} className="payment-card">
              <td>{index + 1}</td>
              <td className="payment-id">{payment.customer}</td>
              <td className="payment-name">{payment.name}</td>
              <td className="payment-date">
                {formatDate(payment.paymentDate)}
              </td>
              <td className="payment-name">&#8377;{payment.amount}</td>
              <td className="payment-phone">{payment.paymentMode}</td>
              <td>
                <button
                  onClick={() => handleDelete(payment._id, payment.customer)}
                  className="delete-button"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td className="finalTotal">Total Payment Received: </td>
            <td className="finalTotal">
              &#8377;{paymentTotal?.totalPaymentReceived}
            </td>
          </tr>
          <tr>
            <td className="finalTotal">Total Online Payment Received: </td>
            <td className="finalTotal">
              &#8377;{paymentTotal?.totalOnlinePayment || 0}
            </td>
          </tr>
          <tr>
            <td className="finalTotal">Total Cash Payment Received: </td>
            <td className="finalTotal">
              &#8377;{paymentTotal?.totalCashPayment || 0}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default PaymentTable;
