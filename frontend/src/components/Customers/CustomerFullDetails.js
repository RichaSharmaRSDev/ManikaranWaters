import React, { useState } from "react";
import copy from "./../../assets/copy.png";
const CustomerFullDetails = ({
  customerDeliveriesHistory = {},
  dateText = "",
  handleCloseModal,
}) => {
  // Function to format date in 'MM/YYYY' format
  function formatMonth(date) {
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${month.toString().padStart(2, "0")}/${year}`;
  }

  // Function to format date in 'DD/MM/YYYY' format
  function formatDate(date) {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day.toString().padStart(2, "0")}/${month.toString().padStart(2, "0")}/${year}`;
  }

  const dateTextForMonth = dateText?.split("-").reverse().join("/");

  const groupedData = {};
  customerDeliveriesHistory?.customerHistoryDeliveries?.forEach((delivery) => {
    const date = new Date(delivery.deliveryDate);
    const monthYear = formatMonth(date);
    const formattedDate = formatDate(date);

    if (dateTextForMonth?.length) {
      if (monthYear !== dateTextForMonth) return;
    }

    if (!groupedData[monthYear]) {
      groupedData[monthYear] = {};
    }

    if (!groupedData[monthYear][formattedDate]) {
      groupedData[monthYear][formattedDate] = [];
    }

    const data = {};
    if (delivery.returnedJars > 0) {
      data["returnedJars"] = delivery.returnedJars;
    }
    if (delivery.deliveredQuantity > 0) {
      data["deliveredJars"] = delivery.deliveredQuantity;
    }
    data["deliveryAssociateName"] = delivery.deliveryAssociateName;

    groupedData[monthYear][formattedDate].push(data);
  });

  customerDeliveriesHistory?.customerHistoryPaymnets.forEach((payment) => {
    const date = new Date(payment.paymentDate);
    const monthYear = formatMonth(date);
    const formattedDate = formatDate(date);

    if (dateTextForMonth?.length) {
      if (monthYear !== dateTextForMonth) return;
    }

    if (!groupedData[monthYear]) {
      groupedData[monthYear] = {};
    }

    if (!groupedData[monthYear][formattedDate]) {
      groupedData[monthYear][formattedDate] = [];
    }

    const data = {};
    if (payment.amount > 0) {
      data["amountReceived"] = payment.amount;
      data["paymentMode"] = payment.paymentMode;
    }

    groupedData[monthYear][formattedDate].push(data);
  });

  const [copiedText, setCopiedText] = useState("");

  const copyTextToClipboard = (monthYear) => {
    let textToCopy = "";

    Object.keys(groupedData[monthYear]).forEach((date) => {
      textToCopy += `${date}\n`;
      groupedData[monthYear][date].forEach((i) => {
        if (i?.deliveredJars > 0) {
          textToCopy += `Delivered: ${i.deliveredJars}\n`;
        }
        if (i?.returnedJars > 0) {
          textToCopy += `Returned: ${i.returnedJars}\n`;
        }
        if (i?.deliveryAssociateName?.length) {
          textToCopy += `Associate: ${i.deliveryAssociateName}\n`;
        }
        if (i?.amountReceived > 0) {
          textToCopy += `Amount: ${i.amountReceived}\n`;
          textToCopy += `Mode: ${i.paymentMode}\n`;
        }
      });
      textToCopy += "\n";
    });

    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        setCopiedText(monthYear);
        setTimeout(() => setCopiedText(""), 3000);
      })
      .catch((error) => console.error("Failed to copy:", error));
  };
  return (
    <div className="modal full-customer-modal">
      <div className="modal-bg"></div>
      <div className="modal-text">
        {Object.keys(groupedData).map((monthYear) => (
          <div key={monthYear} className="customerDeliveriesHistory">
            <span>{monthYear}</span>
            <button onClick={() => copyTextToClipboard(monthYear)}>
              {copiedText === monthYear ? (
                <span className="success">Copied!</span>
              ) : (
                <img src={copy} alt="copy" />
              )}
            </button>
            {Object.keys(groupedData[monthYear]).map((date) => (
              <div key={date} className="customerDeliveriesHistory-date">
                <div>{date}</div>
                <div>
                  {groupedData[monthYear][date].map((i, index) => {
                    return (
                      <div key={index} className="details-history">
                        {i?.deliveredJars > 0 && (
                          <div>Delivered: {i?.deliveredJars}</div>
                        )}
                        {i?.returnedJars > 0 && (
                          <div>Returned: {i?.returnedJars}</div>
                        )}
                        {i?.deliveryAssociateName?.length && (
                          <div>Associate: {i?.deliveryAssociateName}</div>
                        )}
                        {i?.amountReceived > 0 && (
                          <>
                            <div>Amount: {i?.amountReceived}</div>
                            <div>Mode: {i?.paymentMode}</div>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        ))}
        <div className="closeModal" onClick={handleCloseModal}>
          &#x2715;
        </div>
      </div>
    </div>
  );
};

export default CustomerFullDetails;
