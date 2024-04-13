import React, { useEffect, useState } from "react";
import Loader from "../layout/Loader/Loader";
import Navigation from "../Navigation/Navigation";
import Title from "../layout/Title";
import { getTripsByDate } from "../../actions/tripsAction";
import { useDispatch, useSelector } from "react-redux";
import Alert from "../layout/Alert/Alert";

const ArrangeTrips = () => {
  const dispatch = useDispatch();
  const { showNavigation } = useSelector((state) => state.navigation);
  const { tripsByDate, tripsByDateLoading } = useSelector(
    (state) => state.trips
  );
  const formatDate = (date) => {
    return date.toISOString().split("T")[0];
  };

  const handleDateChange = (event) => {
    const newDate = new Date(event.target.value);
    setSelectedDate(formatDate(newDate));
  };

  const [selectedDate, setSelectedDate] = useState(formatDate(new Date()));
  const [currentTripIndex, setCurrentTripIndex] = useState(0);
  const [leftTabCustomers, setLeftTabCustomers] = useState([]);
  const [rightTabCustomers, setRightTabCustomers] = useState([]);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    dispatch(getTripsByDate(selectedDate));
  }, [selectedDate, currentTripIndex]);

  useEffect(() => {
    if (tripsByDate?.length > 0) {
      setLeftTabCustomers(tripsByDate[currentTripIndex]?.customers);
    }
  }, [tripsByDate, currentTripIndex]);

  const handleDragStart = (e, customer) => {
    e.dataTransfer.setData("customer", JSON.stringify(customer));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, tab) => {
    e.preventDefault();
    const customer = JSON.parse(e.dataTransfer.getData("customer"));
    if (tab === "rightTab") {
      setRightTabCustomers((prevCustomers) => {
        if (!prevCustomers.find((c) => c.customerId === customer.customerId)) {
          return [...prevCustomers, customer];
        }
        return prevCustomers;
      });
      setLeftTabCustomers((prevCustomers) =>
        prevCustomers.filter((c) => c.customerId !== customer.customerId)
      );
    } else {
      setLeftTabCustomers((prevCustomers) => {
        if (!prevCustomers.find((c) => c.customerId === customer.customerId)) {
          return [...prevCustomers, customer];
        }
        return prevCustomers;
      });
      setRightTabCustomers((prevCustomers) =>
        prevCustomers.filter((c) => c.customerId !== customer.customerId)
      );
    }
  };

  const handleCloseAlert = () => {
    setAlert(null);
  };

  const handleSubmission = async () => {
    if (!rightTabCustomers.length) return;
    try {
      const tripData = {
        tripDate: selectedDate,
        tripNumber: tripsByDate[currentTripIndex]?.tripNumber,
        deliveryGuy: tripsByDate[currentTripIndex]?.deliveryGuy,
        customers: rightTabCustomers,
      };

      const response = await fetch(
        `/api/v1/trips/overwrite-trip/${selectedDate}/${tripsByDate[currentTripIndex].tripNumber}}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(tripData),
        }
      );

      if (response.ok) {
        setAlert({
          type: "success",
          message: `${selectedDate} of ${tripsByDate[currentTripIndex]?.tripNumber} by ${tripsByDate[currentTripIndex]?.deliveryGuy} updated successfully!`,
        });
        setLeftTabCustomers(rightTabCustomers);
        setRightTabCustomers([]);
        console.log("Trip updated successfully");
      } else {
        console.error("Failed to update trip");
      }
    } catch (error) {
      setAlert({
        type: "error",
        message: `${error}`,
      });
      console.error("Error during submission:", error);
    }
  };

  const goToNextTrip = () => {
    if (currentTripIndex < tripsByDate.length - 1) {
      setCurrentTripIndex(currentTripIndex + 1);
    }
  };

  const goToPreviousTrip = () => {
    if (currentTripIndex > 0) {
      setCurrentTripIndex(currentTripIndex - 1);
    }
  };

  return (
    <>
      <Title title={"Delivery List"} />
      <Navigation />
      {tripsByDateLoading ? (
        <Loader />
      ) : (
        <>
          <div className={showNavigation ? "beNeutral" : "shiftLeft"}>
            <div className="deliveryDate-select">
              <span>Select Trip Date</span>
              <input
                type="date"
                value={selectedDate}
                onChange={handleDateChange}
              />
            </div>
            <div className="tripsDiv">
              <button
                className="blue-cta"
                onClick={goToPreviousTrip}
                disabled={currentTripIndex === 0}
              >
                Previous Trip
              </button>
              <button
                className="blue-cta"
                onClick={goToNextTrip}
                disabled={currentTripIndex === tripsByDate.length - 1}
              >
                Next Trip
              </button>
            </div>
            {tripsByDateLoading ? (
              <Loader />
            ) : tripsByDate.length ? (
              <>
                <div className="tripNumberHeading">
                  {tripsByDate[currentTripIndex]?.tripNumber} —{" "}
                  {tripsByDate[currentTripIndex]?.deliveryGuy}
                </div>
                <div className="customerTabsArrange">
                  <div
                    className="leftTab"
                    onDragOver={(e) => handleDragOver(e)}
                    onDrop={(e) => handleDrop(e, "leftTab")}
                  >
                    {Array.isArray(leftTabCustomers) &&
                      leftTabCustomers?.map((customer, index) => (
                        <div
                          key={index}
                          className="customersTabs"
                          draggable="true"
                          onDragStart={(e) => handleDragStart(e, customer)}
                        >
                          <div>{customer.customerId}</div>
                          <div>{customer.name}</div>
                          <div>{customer.allotment}</div>
                          <div>{customer.customMessage}</div>
                        </div>
                      ))}
                  </div>
                  <div
                    className="rightTab"
                    onDragOver={(e) => handleDragOver(e)}
                    onDrop={(e) => handleDrop(e, "rightTab")}
                  >
                    {Array.isArray(rightTabCustomers) &&
                      rightTabCustomers?.map((customer, index) => (
                        <div
                          key={index}
                          className="customersTabs"
                          draggable="true"
                          onDragStart={(e) => handleDragStart(e, customer)}
                        >
                          <div>{customer.customerId}</div>
                          <div>{customer.name}</div>
                          <div>{customer.allotment}</div>
                        </div>
                      ))}
                  </div>
                </div>
                <button
                  className="common-cta common-cta-small"
                  onClick={handleSubmission}
                >
                  Submit
                </button>
                {alert && (
                  <Alert
                    type={alert.type}
                    message={alert.message}
                    onClose={handleCloseAlert}
                  />
                )}
              </>
            ) : (
              "no results"
            )}
          </div>
        </>
      )}
    </>
  );
};

export default ArrangeTrips;
