import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import Loader from "../layout/Loader/Loader";
import Navigation from "../Navigation/Navigation";
import Title from "../layout/Title";
import { getCustomersByNextDeliveryDate } from "../../actions/customerAction";
import "./Trip.scss";
import { getAllTrips, getAllDeliveryGuyName } from "../../actions/tripsAction";

const DeliveryList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [chosenTrip, setChosenTrip] = useState("");
  const [deliveryGuy, setDeliveryGuy] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [nextDeliveryDay, setNextDeliveryDay] = useState(new Date(Date.now()));
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const { showNavigation } = useSelector((state) => state.navigation);
  const { allTrips, deliveryGuyNames } = useSelector(
    (state) => state.trips || {}
  );
  const { customersPredictions, loading, customersPredictionsCount } =
    useSelector((state) => state.customers || {});
  const dispatch = useDispatch();
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const handleCheckboxChange = (
    customerId,
    name,
    phoneNo,
    address,
    allotment
  ) => {
    // Check if the customer is already selected
    const isSelected = selectedCustomers.some(
      (selected) => selected.customerId === customerId
    );

    if (isSelected) {
      // If already selected, remove it
      setSelectedCustomers((prevSelectedCustomers) =>
        prevSelectedCustomers.filter(
          (selected) => selected.customerId !== customerId
        )
      );
    } else {
      // If not selected, add it
      setSelectedCustomers((prevSelectedCustomers) => [
        ...prevSelectedCustomers,
        { customerId, name, phoneNo, address, allotment },
      ]);
    }
  };

  const handleAddToTrip = async () => {
    if (
      selectedCustomers.length === 0 ||
      chosenTrip.length === 0 ||
      deliveryGuy.length === 0
    ) {
      return;
    }
    if (
      allTrips?.some(
        (details) =>
          chosenTrip === details.tripNumber &&
          selectedDate.toISOString().split("T")[0] ===
            details.tripDate.split("T")[0]
      )
    ) {
      try {
        await axios.put(`/api/v1/trip/${selectedDate}/${chosenTrip}`, {
          customers: selectedCustomers,
          tripNumber: chosenTrip,
          tripDate: selectedDate.toISOString().split("T")[0],
          deliveryGuy,
        });
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        await axios.post(`/api/v1/trip/new`, {
          customers: selectedCustomers,
          tripNumber: chosenTrip,
          tripDate: selectedDate.toISOString().split("T")[0],
          deliveryGuy,
        });
      } catch (error) {
        console.log(error);
      }
    }
    setSelectedCustomers([]);
    setChosenTrip("");
    setSelectedDate(new Date());
    setDeliveryGuy("");

    setTimeout(() => {
      dispatch(getAllTrips());
    }, 1200);
  };

  useEffect(() => {
    dispatch(getCustomersByNextDeliveryDate(nextDeliveryDay, currentPage));
  }, [nextDeliveryDay, currentPage]);

  useEffect(() => {
    dispatch(getAllTrips());
    dispatch(getAllDeliveryGuyName());
  }, []);

  return (
    <>
      <Title title={"Delivery List"} />
      <Navigation />
      {loading ? (
        <Loader />
      ) : (
        <>
          <div className={showNavigation ? "beNeutral" : "shiftLeft"}>
            <div className="nextDeliveryDate-select">
              <span>Select Next Delivery Date for Customers</span>
              <input
                type="date"
                value={
                  new Date(
                    nextDeliveryDay.getTime() +
                      nextDeliveryDay.getTimezoneOffset() * 60000 +
                      5.5 * 60 * 60 * 1000
                  )
                    .toISOString()
                    .split("T")[0]
                }
                onChange={(e) => setNextDeliveryDay(new Date(e.target.value))}
              />
            </div>
            <div className="customersList">
              {customersPredictions?.map((customer) => (
                <div className="eachCustomer" key={customer.customerId}>
                  <input
                    type="checkbox"
                    value={customer.customerId}
                    checked={selectedCustomers.some(
                      (selected) => selected.customerId === customer.customerId
                    )}
                    onChange={() =>
                      handleCheckboxChange(
                        customer.customerId,
                        customer.name,
                        customer.phoneNo,
                        customer.address,
                        customer.allotment
                      )
                    }
                  />
                  <div>{customer.customerId}</div>
                  <div>{customer.name}</div>
                  <div>{customer.zone}</div>
                  <div>{customer.frequency}</div>
                  <div>{customer.nextDelivery}</div>
                  <div>{customer.lastDeliveryDate}</div>
                  <div>{customer.allotment}</div>
                </div>
              ))}
            </div>
            <div className="tripActions">
              <input
                type="date"
                value={
                  new Date(
                    selectedDate.getTime() +
                      selectedDate.getTimezoneOffset() * 60000 +
                      5.5 * 60 * 60 * 1000 // Adjusting for IST (5.5 hours ahead of GMT)
                  )
                    .toISOString()
                    .split("T")[0]
                }
                onChange={(e) => setSelectedDate(new Date(e.target.value))}
              />

              <select
                required
                onChange={(e) => setChosenTrip(e.target.value)}
                value={chosenTrip}
              >
                <option value="" hidden>
                  Select Trip
                </option>
                <option value="trip1">Trip 1</option>
                <option value="trip2">Trip 2</option>
                <option value="trip3">Trip 3</option>
                <option value="trip4">Trip 4</option>
                <option value="trip5">Trip 5</option>
              </select>

              <select
                required
                onChange={(e) => setDeliveryGuy(e.target.value)}
                value={deliveryGuy}
              >
                <option value="" hidden>
                  Delivery Guy
                </option>
                {deliveryGuyNames.map((deliveryMan) => (
                  <option value={deliveryMan.name}>{deliveryMan.name}</option>
                ))}
              </select>

              <button onClick={handleAddToTrip}>Add to Trip</button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default DeliveryList;
