import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../layout/Loader/Loader";
import Navigation from "../Navigation/Navigation";
import Title from "../layout/Title";
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
  const dispatch = useDispatch();

  const handleDateChange = (event) => {
    const newDate = new Date(event.target.value);
    setSelectedDate(formatDate(newDate));
  };

  const dragCustomer = useRef(null);
  const draggedOverCustomer = useRef(null);

  function handleSort() {
    const customersClone = [...customers];
    const temp = customersClone[dragCustomer.current];
    customersClone[dragCustomer.current] =
      customersClone[draggedOverCustomer.current];
    customersClone[draggedOverCustomer.current] = temp;
    setCustomers(customersClone);
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
        console.log("Trip updated successfully");
      } else {
        console.error("Failed to update trip");
      }
    } catch (error) {
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
                <div>{tripsByDate[currentTripIndex]?.tripNumber}</div>
                <div>
                  <input
                    type="text"
                    value={newCustomerInput}
                    onChange={(e) => setNewCustomerInput(e.target.value)}
                  />
                  <button onClick={addCustomer}>Add Customer</button>
                </div>

                {Array.isArray(customers) &&
                  customers?.map((customer, index) => (
                    <div
                      key={index}
                      className="customersTabs"
                      draggable
                      onDragStart={() => (dragCustomer.current = index)}
                      onDragEnter={() => (draggedOverCustomer.current = index)}
                      onDragEnd={handleSort}
                      onDragOver={(e) => e.preventDefault()}
                    >
                      <div>{customer.customerId}</div>
                      <div>{customer.name}</div>
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
                      <button onClick={() => removeCustomer(index)}>
                        Remove
                      </button>
                    </div>
                  ))}
                <button onClick={handleSubmission}>Submit</button>
              </div>
              <div>
                <button
                  onClick={goToPreviousTrip}
                  disabled={currentTripIndex === 0}
                >
                  Previous Trip
                </button>
                <button
                  onClick={goToNextTrip}
                  disabled={currentTripIndex === tripsByDate.length - 1}
                >
                  Next Trip
                </button>
              </div>
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
