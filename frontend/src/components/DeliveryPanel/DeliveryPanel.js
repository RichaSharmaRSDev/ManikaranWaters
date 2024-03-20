import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../layout/Loader/Loader";
import Navigation from "../Navigation/Navigation";
import Title from "../layout/Title";
import { getTripsByDateAndDeliveryGuy } from "../../actions/tripsAction";
import "./DeliveryPanel.scss";
import { createDelivery } from "../../actions/deliveryAction";

const DeliveryPanel = () => {
  const { isAuthenticated, user, loading } = useSelector((state) => state.user);
  const { tripsByDateAndDeliveryGuy, tripsByDateAndDeliveryGuyLoading } =
    useSelector((state) => state.trips || {});
  const { showNavigation } = useSelector((state) => state.navigation);
  const { _id } = useSelector((state) => state.deliveries.newDelivery || "");
  const [tripCustomers, setTripCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState([]);
  const [deliveryPopUp, setDeliveryPopUp] = useState(false);
  const [deliveredCans, setDeliveredCans] = useState("");
  const [cashReceived, setCashReceived] = useState("");
  const [returnedCans, setReturnedCans] = useState("");
  const [tripNumber, setTripNumber] = useState("");

  const dispatch = useDispatch();

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const closeDeliveryPopUp = () => {
    setDeliveryPopUp(false);
    setCashReceived("");
    setDeliveredCans("");
    setReturnedCans("");
    setSelectedCustomer(null);
  };
  const date = formatDate(new Date());

  const submitDeliveryRequest = async (customerId) => {
    const deliveryData = {
      customerId: customerId,
      deliveredQuantity: deliveredCans,
      deliveryAssociateName: deliveryGuyName,
      deliveryDate: date,
      returnedJars: returnedCans,
    };
    if (cashReceived > 0) {
      deliveryData.amountReceived = cashReceived;
      deliveryData.paymentMode = "cash";
    }
    dispatch(createDelivery(deliveryData))
      .then(async () => {
        try {
          const updatedCustomers = tripCustomers.map((customer) => {
            return customer.customerId === customerId
              ? {
                  ...customer,
                  isDelivered: true,
                  deliveredCans,
                  returnedCans,
                  ...(cashReceived > 0 && { cashReceived }),
                }
              : customer;
          });

          setTripCustomers(updatedCustomers);

          const tripData = {
            tripDate: date,
            tripNumber,
            deliveryGuy: deliveryGuyName,
            customers: updatedCustomers,
          };
          const response = await fetch(
            `/api/v1/trips/overwrite-trip/${date}/${tripNumber}`,
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
            dispatch(getTripsByDateAndDeliveryGuy(date, deliveryGuyName));
          } else {
            console.error("Failed to update trip");
          }
        } catch (error) {
          console.error("Error during submission:", error);
        }
      })
      .catch((error) => {
        console.log(error);
      });

    closeDeliveryPopUp();
  };

  const deliveryGuyName = user.name;

  useEffect(() => {
    dispatch(getTripsByDateAndDeliveryGuy(date, deliveryGuyName));
  }, []);

  const handleTripClick = (tripNumber) => {
    const selectedTrip = tripsByDateAndDeliveryGuy.find(
      (trip) => trip.tripNumber === tripNumber
    );
    setTripCustomers(selectedTrip ? selectedTrip.customers : []);
    setTripNumber(tripNumber);
  };

  return (
    <>
      <Title title={"Delivery Panel"} />
      <Navigation />
      {loading ? (
        <Loader />
      ) : (
        <>
          <div className={showNavigation ? "beNeutral" : "shiftLeft"}>
            {tripsByDateAndDeliveryGuyLoading ? (
              <Loader />
            ) : tripsByDateAndDeliveryGuy?.length ? (
              <>
                <div className="customersPanel">
                  {tripsByDateAndDeliveryGuy.map((trip, index) => (
                    <button
                      className="blue-cta"
                      key={index}
                      onClick={() => handleTripClick(trip.tripNumber)}
                    >
                      {trip.tripNumber}
                    </button>
                  ))}
                </div>
                <div className="customersDeliveryPanelContent">
                  {tripCustomers?.length &&
                    tripCustomers?.map((customer, index) => (
                      <>
                        <div
                          key={index}
                          className="customersTripList"
                          onClick={() => {
                            setDeliveryPopUp(true);
                            setSelectedCustomer(customer);
                          }}
                        >
                          <div>{customer.name}</div>
                          <div>{customer.allotment}</div>
                          <div>{customer.phoneNo}</div>
                          <div>{customer.address}</div>
                          {customer?.customMessage && (
                            <div>{customer.customMessage}</div>
                          )}
                          {customer?.isDelivered && (
                            <div className="success">&#10003;</div>
                          )}
                        </div>
                        {deliveryPopUp && (
                          <div className="modal delivery-panel-modal">
                            <div className="modal-bg"></div>
                            <div className="modal-text">
                              <div className="values">
                                <span>Name:</span>{" "}
                                <span>{selectedCustomer.name}</span>
                              </div>
                              <div className="values address">
                                <span>Address:</span>{" "}
                                <span>{selectedCustomer.address}</span>
                              </div>
                              <div className="values phoneNo">
                                <span>Phone No:</span>{" "}
                                <span>{selectedCustomer.phoneNo}</span>
                              </div>
                              <div className="values">
                                <span>Allotment:</span>{" "}
                                <span>{selectedCustomer.allotment}</span>
                              </div>
                              {selectedCustomer.customMessage && (
                                <div className="values">
                                  <span>Custom Message:</span>{" "}
                                  <span>{selectedCustomer.customMessage}</span>
                                </div>
                              )}
                              {selectedCustomer.isDelivered ? (
                                <>
                                  <div className="values">
                                    <span>Delivered Jars:</span>
                                    <span>
                                      {selectedCustomer.deliveredCans}
                                    </span>
                                  </div>
                                  <div className="values">
                                    <span>Returned Jars:</span>
                                    <span>{selectedCustomer.returnedCans}</span>
                                  </div>
                                  <div className="values">
                                    <span>Cash Received:</span>
                                    <span>
                                      {selectedCustomer?.cashReceived || "0"}
                                    </span>
                                  </div>
                                </>
                              ) : (
                                <>
                                  <div className="values">
                                    <label className="inputLabel">
                                      Delivered Jars:
                                    </label>
                                    <input
                                      type="number"
                                      value={deliveredCans || ""}
                                      onChange={(e) =>
                                        setDeliveredCans(e.target.value)
                                      }
                                    />
                                  </div>
                                  <div className="values">
                                    <label className="inputLabel">
                                      Returned Jars:
                                    </label>
                                    <input
                                      type="number"
                                      value={returnedCans || ""}
                                      onChange={(e) =>
                                        setReturnedCans(e.target.value)
                                      }
                                    />
                                  </div>
                                  <div className="values">
                                    <label className="inputLabel">
                                      Cash Received:
                                    </label>
                                    <input
                                      type="number"
                                      value={cashReceived || ""}
                                      onChange={(e) =>
                                        setCashReceived(e.target.value)
                                      }
                                    />
                                  </div>
                                </>
                              )}
                              <div className="delivery-modal-buttons">
                                {!selectedCustomer.isDelivered && (
                                  <div
                                    className="success-bg"
                                    onClick={() =>
                                      submitDeliveryRequest(
                                        selectedCustomer.customerId
                                      )
                                    }
                                  >
                                    SUCCESS
                                  </div>
                                )}
                                <div
                                  className="cancel-bg"
                                  onClick={closeDeliveryPopUp}
                                >
                                  {selectedCustomer.isDelivered
                                    ? "Close"
                                    : "Cancel"}
                                </div>
                              </div>
                              <div
                                className="closeModal"
                                onClick={closeDeliveryPopUp}
                              >
                                &#x2715;
                              </div>
                            </div>
                          </div>
                        )}
                      </>
                    ))}
                </div>
              </>
            ) : (
              <div>No Trips Found</div>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default DeliveryPanel;
