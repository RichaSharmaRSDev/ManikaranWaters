const CustomerFullDetails = ({ customerFullDetail = {}, handleCloseModal }) => {
  const groupedData = customerFullDetail.deliveries.reduce(
    (result, delivery) => {
      const deliveryDate = new Date(delivery.deliveryDate);
      const monthKey = deliveryDate.toLocaleString("en-US", {
        year: "numeric",
        month: "numeric",
      });
      const dayKey = deliveryDate.getDate();

      // Group deliveries by month
      if (!result[monthKey]) {
        result[monthKey] = {};
      }

      // Group deliveries by day within each month
      if (!result[monthKey][dayKey]) {
        result[monthKey][dayKey] = {
          deliveries: [],
          payments: [],
        };
      }

      // Add delivery to the corresponding day
      result[monthKey][dayKey].deliveries.push(delivery);

      return result;
    },
    {}
  );

  // Add payments to the grouped data
  customerFullDetail.payments.forEach((payment) => {
    const paymentDate = new Date(payment.paymentDate);
    const monthKey = paymentDate.toLocaleString("en-US", {
      year: "numeric",
      month: "numeric",
    });
    const dayKey = paymentDate.getDate();

    if (!groupedData[monthKey]) {
      groupedData[monthKey] = {};
    }

    if (!groupedData[monthKey][dayKey]) {
      groupedData[monthKey][dayKey] = {
        deliveries: [],
        payments: [],
      };
    }

    groupedData[monthKey][dayKey].payments.push(payment);
  });

  // Render grouped data in the UI
  return (
    <div className="modal full-customer-modal">
      <div className="modal-bg"></div>
      <div className="modal-text">
        {Object.keys(groupedData).map((monthKey) => (
          <div key={monthKey}>
            <div className="monthYear">{monthKey}</div>
            {Object.keys(groupedData[monthKey]).map((dayKey) => (
              <div key={dayKey}>
                <div>{`Date: ${dayKey}/${monthKey}`}</div>
                {/* Render deliveries for the day */}
                <ul>
                  {groupedData[monthKey][dayKey].deliveries.map((delivery) => (
                    <li key={delivery._id}>{`Delivered: ${
                      delivery.deliveredQuantity
                    } Returned: ${delivery.returnedJars || 0}`}</li>
                  ))}

                  {/* Render payments for the day */}
                  {groupedData[monthKey][dayKey].payments.map((payment) => (
                    <li
                      key={payment._id}
                    >{`Payment: ${payment.amount} - ${payment.paymentMode}`}</li>
                  ))}
                </ul>
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
