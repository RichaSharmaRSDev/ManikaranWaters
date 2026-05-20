import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import Loader from "../layout/Loader/Loader";
import { dateToIST } from "../../utils/istDate";
import { getCustomersByNextDeliveryDateMore } from "../../actions/customerAction";
import {
  getAllTrips,
  getAllDeliveryGuyName,
  getTripsByDate,
} from "../../actions/tripsAction";
import { Pagination } from "../layout/Pagination/Pagination";
import Alert from "../layout/Alert/Alert";

const MakeTrip = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [chosenTrip, setChosenTrip] = useState("");
  const [deliveryGuy, setDeliveryGuy] = useState("");
  const [predictionDate, setPredictionDate] = useState(new Date());
  const [deliveryDate, setDeliveryDate] = useState(new Date());
  const [alert, setAlert] = useState(null);
  const previousPredictionDateRef = useRef(null);

  const { allTrips, deliveryGuyNames, tripsByDate } = useSelector(
    (state) => state.trips || {}
  );
  const customerIds = tripsByDate?.flatMap((t) =>
    t.customers.map((c) => c.customerId)
  );
  const { customersPredictions, loading, customersPredictionsCount } =
    useSelector((state) => state.customers || {});
  const dispatch = useDispatch();
  const totalPages = Math.ceil(customersPredictionsCount / 50);

  useEffect(() => {
    previousPredictionDateRef.current = predictionDate;
  }, []);

  const toggleCustomer = (customerId, name, phoneNo, address, allotment) => {
    const isSelected = selectedCustomers.some((s) => s.customerId === customerId);
    if (isSelected) {
      setSelectedCustomers((prev) => prev.filter((s) => s.customerId !== customerId));
    } else {
      setSelectedCustomers((prev) => [...prev, { customerId, name, phoneNo, address, allotment }]);
    }
  };

  const handleAddToTrip = async () => {
    if (!selectedCustomers.length || !chosenTrip || !deliveryGuy) return;

    const tripExists = allTrips?.some(
      (details) =>
        chosenTrip === details.tripNumber &&
        dateToIST(deliveryDate) === details.tripDate.split("T")[0]
    );

    try {
      if (tripExists) {
        const res = await axios.put(`/api/v1/trip/${deliveryDate}/${chosenTrip}`, {
          customers: selectedCustomers,
          tripNumber: chosenTrip,
          tripDate: dateToIST(deliveryDate),
          deliveryGuy,
        });
        if (res.status === 200) {
          setAlert({ type: "success", message: `${chosenTrip} by ${deliveryGuy} updated successfully!` });
        }
      } else {
        const res = await axios.post(`/api/v1/trip/new`, {
          customers: selectedCustomers,
          tripNumber: chosenTrip,
          tripDate: dateToIST(deliveryDate),
          deliveryGuy,
        });
        if (res.status === 201) {
          setAlert({ type: "success", message: `${chosenTrip} by ${deliveryGuy} added successfully!` });
        }
      }
    } catch (error) {
      setAlert({ type: "error", message: String(error) });
    }

    setSelectedCustomers([]);
    setChosenTrip("");
    setDeliveryGuy("");
    setTimeout(() => dispatch(getAllTrips()), 1200);
  };

  useEffect(() => {
    if (predictionDate !== previousPredictionDateRef.current) {
      dispatch(getCustomersByNextDeliveryDateMore(predictionDate, 1));
      previousPredictionDateRef.current = predictionDate;
      setCurrentPage(1);
    } else {
      dispatch(getCustomersByNextDeliveryDateMore(predictionDate, currentPage));
    }
  }, [predictionDate, currentPage]);

  useEffect(() => {
    dispatch(getAllTrips());
    dispatch(getAllDeliveryGuyName());
  }, []);

  useEffect(() => {
    dispatch(getTripsByDate(deliveryDate));
  }, [deliveryDate]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="maketrip-assignbar">
            <label className="maketrip-datepicker">
              <span className="maketrip-datelabel">Delivery</span>
              <input
                type="date"
                value={dateToIST(deliveryDate)}
                onChange={(e) => setDeliveryDate(new Date(e.target.value))}
              />
            </label>
            <div className="maketrip-divider" />
            <select value={chosenTrip} onChange={(e) => setChosenTrip(e.target.value)}>
              <option value="" hidden>Trip</option>
              <option value="trip1">Trip 1</option>
              <option value="trip2">Trip 2</option>
              <option value="trip3">Trip 3</option>
              <option value="trip4">Trip 4</option>
              <option value="trip5">Trip 5</option>
              <option value="trip6">Trip 6</option>
              <option value="trip7">Trip 7</option>
            </select>

            <select value={deliveryGuy} onChange={(e) => setDeliveryGuy(e.target.value)}>
              <option value="" hidden>Name</option>
              {deliveryGuyNames?.map((d) => (
                <option key={d.name} value={d.name}>{d.name}</option>
              ))}
            </select>

            <span className="maketrip-count">{selectedCustomers.length} selected</span>
            <button className="maketrip-clear" onClick={() => setSelectedCustomers([])}>
              &#x2715; Clear
            </button>
            <button
              className="maketrip-add"
              onClick={handleAddToTrip}
              disabled={!selectedCustomers.length || !chosenTrip || !deliveryGuy}
            >
              Add to trip &#x2192;
            </button>
            <label className="maketrip-datepicker maketrip-prediction">
              <span className="maketrip-datelabel">Prediction</span>
              <input
                type="date"
                value={dateToIST(predictionDate)}
                onChange={(e) => setPredictionDate(new Date(e.target.value))}
              />
            </label>
          </div>

          <div className="maketrip-table">
            <div className="maketrip-thead">
              <div className="mt-check" />
              <div className="mt-id">ID</div>
              <div className="mt-name">NAME</div>
              <div className="mt-zone">ZONE</div>
              <div className="mt-freq">FREQ</div>
              <div className="mt-date">NEXT DELIVERY</div>
              <div className="mt-date">LAST DELIVERY</div>
              <div className="mt-allot">ALLOTMENT</div>
            </div>
            <div className="maketrip-tbody">
              {customersPredictions?.map((customer) => {
                if (customerIds?.length && customerIds.includes(customer.customerId)) return null;
                const isSelected = selectedCustomers.some((s) => s.customerId === customer.customerId);
                return (
                  <div
                    key={customer.customerId}
                    className={`maketrip-row${isSelected ? " selected" : ""}`}
                    onClick={() =>
                      toggleCustomer(
                        customer.customerId,
                        customer.name,
                        customer.phoneNo,
                        customer.address,
                        customer.allotment
                      )
                    }
                  >
                    <div className="mt-check">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {}}
                        onClick={(e) => { e.stopPropagation(); toggleCustomer(customer.customerId, customer.name, customer.phoneNo, customer.address, customer.allotment); }}
                      />
                    </div>
                    <div className="mt-id">{customer.customerId}</div>
                    <div className="mt-name">{customer.name}</div>
                    <div className="mt-zone">{customer.zone}</div>
                    <div className="mt-freq">{customer.frequency}</div>
                    <div className="mt-date">
                      {new Date(customer.nextDelivery).toLocaleDateString("en-US", { day: "numeric", month: "short" })}
                    </div>
                    <div className="mt-date">
                      {new Date(customer.lastDeliveryDate).toLocaleDateString("en-US", { day: "numeric", month: "short" })}
                    </div>
                    <div className="mt-allot">{customer.allotment}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {totalPages > 1 && (
            <>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => setCurrentPage(page)}
              />
              <span>
                Page {currentPage} of {totalPages} &middot; {customersPredictionsCount} customers
              </span>
            </>
          )}

          {alert && (
            <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />
          )}
        </>
      )}
    </>
  );
};

export default MakeTrip;
