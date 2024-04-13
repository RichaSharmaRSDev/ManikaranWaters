import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../layout/Loader/Loader";
import Navigation from "../Navigation/Navigation";
import Title from "../layout/Title";
import Alert from "../layout/Alert/Alert";
import "./Trip.scss";
import {
  getTripsByDate,
  getAllDeliveryGuyName,
} from "../../actions/tripsAction";

const Trips = () => {
  const { isAuthenticated, user, loading } = useSelector((state) => state.user);
  const { showNavigation } = useSelector((state) => state.navigation);
  const { tripsByDate, tripsByDateLoading, deliveryGuyNames } = useSelector(
    (state) => state.trips || {}
  );
  const formatDate = (date) => {
    return date.toISOString().split("T")[0];
  };

  const [selectedDate, setSelectedDate] = useState(formatDate(new Date()));
  const [customers, setCustomers] = useState([]);
  const [currentTripIndex, setCurrentTripIndex] = useState(0);
  const [newCustomerInput, setNewCustomerInput] = useState("");
  const [customMessages, setCustomMessages] = useState({});
  const [isEdit, setIsEdit] = useState(false);
  const [alert, setAlert] = useState(null);
  const dispatch = useDispatch();

  const handleDateChange = (event) => {
    const newDate = new Date(event.target.value);
    setSelectedDate(formatDate(newDate));
  };

  const dragCustomer = useRef(null);
  const draggedOverCustomer = useRef(null);

  function handleSort() {
    const newCustomers = [...customers];
    const draggedCustomer = newCustomers[dragCustomer.current];
    newCustomers.splice(dragCustomer.current, 1);
    newCustomers.splice(draggedOverCustomer.current, 0, draggedCustomer);
    setCustomers(newCustomers);
  }

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

  const addCustomer = async () => {
    try {
      const response = await fetch(
        `/api/v1/customerForTrips/${newCustomerInput}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const responseData = await response.json();
        console.log("Customer received successfully", responseData);
        setCustomers([responseData.customer, ...customers]);
      } else {
        console.error("customer not found");
      }
    } catch (error) {
      console.error("Error during addition:", error);
    }
    setNewCustomerInput("");
  };

  const removeCustomer = (indexToRemove) => {
    const updatedCustomers = customers.filter(
      (_, index) => index !== indexToRemove
    );
    setCustomers(updatedCustomers);
  };

  const handleSubmission = async () => {
    try {
      const tripData = {
        tripDate: selectedDate,
        tripNumber: tripsByDate[currentTripIndex]?.tripNumber,
        deliveryGuy: tripsByDate[currentTripIndex]?.deliveryGuy,
        customers: customers,
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
    setIsEdit(false);
  };

  const handleCustomMessageChange = (customerId, value) => {
    setCustomers((prevCustomers) => {
      const updatedCustomers = prevCustomers.map((customer) => {
        if (customer.customerId === customerId) {
          return { ...customer, customMessage: value };
        }
        return customer;
      });
      setIsEdit(false);
      return updatedCustomers;
    });
  };

  const handleCloseAlert = () => {
    setAlert(null);
  };

  useEffect(() => {
    dispatch(getTripsByDate(selectedDate));
  }, [selectedDate, currentTripIndex]);

  useEffect(() => {
    dispatch(getAllDeliveryGuyName());
  }, []);

  useEffect(() => {
    if (tripsByDate?.length > 0) {
      setCustomers(tripsByDate[`${currentTripIndex}`]?.customers);
    }
  }, [tripsByDate, currentTripIndex]);

  return (
    <>
      <Title title={"Delivery List"} />
      <Navigation />
      {loading ? (
        <Loader />
      ) : (
        <div className={showNavigation ? "beNeutral" : "shiftLeft"}>
          <div className="deliveryDate-select">
            <span>Select Trip Date</span>
            <input
              type="date"
              value={selectedDate}
              onChange={handleDateChange}
            />
          </div>

          {tripsByDateLoading ? (
            <Loader />
          ) : tripsByDate.length ? (
            <>
              <div>
                <div className="tripNumberHeading">
                  {tripsByDate[currentTripIndex]?.tripNumber} —{" "}
                  {tripsByDate[currentTripIndex]?.deliveryGuy}
                </div>
                <div className="newCustomerAddition">
                  <input
                    type="text"
                    value={newCustomerInput}
                    placeholder="Add Customer ID"
                    onChange={(e) => setNewCustomerInput(e.target.value)}
                  />
                  <button
                    className="common-cta common-cta-small"
                    onClick={addCustomer}
                  >
                    Add Customer
                  </button>
                </div>
                <div className="customersTabContent">
                  {Array.isArray(customers) &&
                    customers?.map((customer, index) => (
                      <div
                        key={index}
                        className="customersTabs"
                        draggable
                        data-index={index}
                        onDragStart={() => (dragCustomer.current = index)}
                        onDragEnd={handleSort}
                        onDragOver={(e) => {
                          e.preventDefault();
                        }}
                        onDragEnter={(e) => {
                          const targetIndex = parseInt(
                            e.target.getAttribute("data-index")
                          );
                          draggedOverCustomer.current = targetIndex;
                        }}
                      >
                        <div>{customer.customerId}</div>
                        <div>{customer.name}</div>
                        <div>{customer.allotment}</div>
                        <div>{customer.phoneNo}</div>
                        <div>{customer.address}</div>
                        {!isEdit && customer.customMessage ? (
                          <div>
                            {customer.customMessage}
                            <button onClick={() => setIsEdit(true)}>
                              &#9998;
                            </button>
                          </div>
                        ) : (
                          <>
                            <input
                              type="text"
                              value={customMessages[customer.customerId] || ""}
                              onChange={(e) =>
                                setCustomMessages({
                                  ...customMessages,
                                  [customer.customerId]: e.target.value,
                                })
                              }
                            />
                            <button
                              className="green-cta"
                              onClick={() =>
                                handleCustomMessageChange(
                                  customer.customerId,
                                  customMessages[customer.customerId]
                                )
                              }
                            >
                              &#10003;
                            </button>
                          </>
                        )}
                        <button
                          className="red-cta"
                          onClick={() => removeCustomer(index)}
                        >
                          X
                        </button>
                      </div>
                    ))}
                </div>
              </div>
              <div className="tripsDiv">
                <button
                  className="common-cta common-cta-small"
                  onClick={handleSubmission}
                >
                  Submit
                </button>
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
              {alert && (
                <Alert
                  type={alert.type}
                  message={alert.message}
                  onClose={handleCloseAlert}
                />
              )}
            </>
          ) : (
            <div>No Trips found</div>
          )}
        </div>
      )}
    </>
  );
};

export default Trips;
