import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import Loader from "../layout/Loader/Loader";
import Navigation from "../Navigation/Navigation";
import Title from "../layout/Title";
import { getCustomersByNextDeliveryDateMore } from "../../actions/customerAction";
import "./Trip.scss";
import {
  getAllTrips,
  getAllDeliveryGuyName,
  getTripsByDate,
} from "../../actions/tripsAction";
import { Pagination } from "../layout/Pagination/Pagination";
import Alert from "../layout/Alert/Alert";

const DeliveryList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [chosenTrip, setChosenTrip] = useState("");
  const [deliveryGuy, setDeliveryGuy] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date(Date.now()));
  const [alert, setAlert] = useState(null);
  const [nextDeliveryDay, setNextDeliveryDay] = useState(new Date(Date.now()));
  // const [exisitingCustomers, setExsistingCustomers] = useState(null);
  const previousDeliveryDayRef = useRef(null);
  const { allTrips, deliveryGuyNames, tripsByDate } = useSelector(
    (state) => state.trips || {}
  );
  const customerIds = tripsByDate.flatMap((t) =>
    t.customers.map((c) => c.customerId)
  );

  useEffect(() => {
    previousDeliveryDayRef.current = nextDeliveryDay;
  }, []);
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const { showNavigation } = useSelector((state) => state.navigation);
  const { customersPredictions, loading, customersPredictionsCount } =
    useSelector((state) => state.customers || {});
  const dispatch = useDispatch();
  const totalPages = Math.ceil(customersPredictionsCount / 50);

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
        await axios
          .put(`/api/v1/trip/${selectedDate}/${chosenTrip}`, {
            customers: selectedCustomers,
            tripNumber: chosenTrip,
            tripDate: selectedDate.toISOString().split("T")[0],
            deliveryGuy,
          })
          .then((res) => {
            if (res.status === 200) {
              setAlert({
                type: "success",
                message: `${chosenTrip} by ${deliveryGuy} updated successfully!`,
              });
            }
          });
      } catch (error) {
        setAlert({ type: "error", message: error });
        console.log(error);
      }
    } else {
      try {
        await axios
          .post(`/api/v1/trip/new`, {
            customers: selectedCustomers,
            tripNumber: chosenTrip,
            tripDate: selectedDate.toISOString().split("T")[0],
            deliveryGuy,
          })
          .then((res) => {
            if (res.status === 201) {
              setAlert({
                type: "success",
                message: `${chosenTrip} by ${deliveryGuy} added successfully!`,
              });
            }
          });
      } catch (error) {
        setAlert({ type: "error", message: error });
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

  const handleCloseAlert = () => {
    setAlert(null);
  };

  useEffect(() => {
    if (nextDeliveryDay !== previousDeliveryDayRef.current) {
      dispatch(getCustomersByNextDeliveryDateMore(nextDeliveryDay, 1));
      previousDeliveryDayRef.current = nextDeliveryDay;
      setCurrentPage(1);
    } else {
      dispatch(
        getCustomersByNextDeliveryDateMore(nextDeliveryDay, currentPage)
      );
    }
  }, [nextDeliveryDay, currentPage]);

  useEffect(() => {
    dispatch(getAllTrips());
    dispatch(getAllDeliveryGuyName());
  }, []);

  useEffect(() => {
    dispatch(getTripsByDate(selectedDate));
  }, [selectedDate]);

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
              <span>Next Delivery Date</span>
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
                <option value="trip6">Trip 6</option>
                <option value="trip7">Trip 7</option>
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

              <button
                className="common-cta common-cta-small"
                onClick={handleAddToTrip}
              >
                Submit
              </button>

              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              )}
            </div>
            <div className="customersList">
              <div className="eachCustomerHeading">
                <div className="eachCustomer_id">Id</div>
                <div className="eachCustomer_name">Name</div>
                <div className="eachCustomer_zone">Zone</div>
                <div className="eachCustomer_zone">Freq</div>
                <div className="eachCustomer_date">Next Delivery</div>
                <div className="eachCustomer_date">Last Delivery</div>
                <div className="eachCustomer_zone">Allotment</div>
              </div>
              <div className="eachCustomerContent">
                {customersPredictions?.map((customer) => {
                  if (
                    customerIds.length &&
                    customerIds.includes(customer.customerId)
                  ) {
                    return null;
                  }
                  return (
                    <div className="eachCustomer" key={customer.customerId}>
                      <input
                        className="eachCustomer_zone"
                        type="checkbox"
                        value={customer.customerId}
                        checked={selectedCustomers.some(
                          (selected) =>
                            selected.customerId === customer.customerId
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
                      <div className="eachCustomer_id">
                        {customer.customerId}
                      </div>
                      <div className="eachCustomer_name">{customer.name}</div>
                      <div className="eachCustomer_zone">{customer.zone}</div>
                      <div className="eachCustomer_zone">
                        {customer.frequency}
                      </div>
                      <div className="eachCustomer_date">
                        {new Date(customer.nextDelivery).toLocaleDateString(
                          "en-US"
                        )}
                      </div>
                      <div className="eachCustomer_date">
                        {new Date(customer.lastDeliveryDate).toLocaleDateString(
                          "en-US"
                        )}
                      </div>
                      <div className="eachCustomer_zone">
                        {customer.allotment}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {alert && (
              <Alert
                type={alert.type}
                message={alert.message}
                onClose={handleCloseAlert}
              />
            )}
          </div>
        </>
      )}
    </>
  );
};

export default DeliveryList;
