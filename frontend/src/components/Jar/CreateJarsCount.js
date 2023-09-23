import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createJarInventory,
  InventoryForDate,
  updateJarInventory,
} from "../../actions/jarCountAction";
import Loader from "../layout/Loader/Loader.js";
import "./jar.scss";
import Name from "../../assets/id-card-clip-alt.svg";
import emptyJar from "../../assets/emptyJar.png";
import filledJar from "../../assets/filledJar.png";
import sun from "../../assets/brightness.svg";
import moon from "../../assets/moon-stars.svg";
import taken from "../../assets/truck-container.svg";
import brought from "../../assets/truck-container-empty.svg";
import Navigation from "../Navigation/Navigation";
// import { useAlert } from "react-alert";
import Title from "../layout/Title";

const CreateJarsCount = () => {
  const dispatch = useDispatch();
  // const alert = useAlert();
  const { showNavigation } = useSelector((state) => state.navigation);
  const { isAuthenticated } = useSelector((state) => state.user);
  const { loading, error, jarForDay, success } = useSelector(
    (state) => state.jars
  );
  const [successMsgAlert, setSuccessMsgAlert] = useState(false);
  const date = new Date(Date.now());
  date.setHours(0, 0, 0, 0);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  const formattedDate = `${year}-${month}-${day}`;

  const initialFormData = {
    date: formattedDate,
    morning: {
      emptyJars: 0,
      filledJars: 0,
    },
    trips: [],
    endOfDay: {
      emptyJars: 0,
      filledJars: 0,
    },
  };

  const [update, setUpdate] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [tripCount, setTripCount] = useState(0);
  const [trips, setTrips] = useState(formData.trips);

  useEffect(() => {
    dispatch(InventoryForDate(formattedDate));
  }, [dispatch, formattedDate]);

  useEffect(() => {
    const jarForDayDate = new Date(jarForDay?.date);
    if (jarForDayDate.getTime() === new Date(formattedDate).getTime()) {
      setUpdate(true);
    }
  }, [jarForDay, formattedDate]);
  useEffect(() => {
    if (success && successMsgAlert) {
      console.log(`${update ? "Upadted" : "Created"} successfully!`);
      setSuccessMsgAlert(false);
    }
  }, [success, successMsgAlert]);
  useEffect(() => {
    if (update && jarForDay) {
      setFormData({
        date: jarForDay.date,
        morning: {
          emptyJars: jarForDay?.morning?.emptyJars,
          filledJars: jarForDay?.morning?.filledJars,
        },
        trips: jarForDay?.trips,
        endOfDay: {
          emptyJars: jarForDay?.endOfDay?.emptyJars,
          filledJars: jarForDay?.endOfDay?.filledJars,
        },
      });
      setTripCount(jarForDay?.trips?.length);
      setTrips(jarForDay?.trips);
    }
  }, [update, jarForDay]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // If the input field name contains '.', split it and update the nested structure
    if (name.startsWith("morning") || name.startsWith("endOfDay")) {
      if (name.includes(".")) {
        const [parent, child] = name.split(".");
        setFormData((prevData) => ({
          ...prevData,
          [parent]: {
            ...prevData[parent],
            [child]: value,
          },
        }));
      }
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const createDefaultTrip = (tripNumber) => ({
    tripNumber,
    associateName: "",
    filledJarsTaken: 0,
    emptyJarsTaken: 0,
    emptyJarsBrought: 0,
    filledJarsBrought: 0,
  });

  // Function to add a new trip
  const handleCreateTrip = () => {
    setTripCount(tripCount + 1);
    setTrips([...trips, createDefaultTrip(tripCount + 1)]);
  };

  // Function to remove the last trip
  const handleCloseTrip = () => {
    if (tripCount > 0) {
      const tripsList = [...trips];
      tripsList.pop();
      setTrips(tripsList);
      setTripCount(tripCount - 1);
      setFormData((prevData) => {
        const updatedTrips = prevData.trips.slice(0, -1);
        return {
          ...prevData,
          trips: updatedTrips,
        };
      });
    }
  };

  // Function to update a trip field
  const handleTripInputChange = (tripIndex, propName, value) => {
    setTrips((prevTrips) =>
      prevTrips.map((trip, index) =>
        index === tripIndex
          ? {
              ...trip,
              [propName]: value,
            }
          : trip
      )
    );
    setFormData((prevData) => ({
      ...prevData,
      trips: trips.map((trip, index) =>
        index === tripIndex
          ? {
              ...trip,
              [propName]: value,
            }
          : trip
      ),
    }));
  };

  const handleJarInventorySubmit = (e) => {
    e.preventDefault();
    if (update) {
      dispatch(updateJarInventory(formData, formattedDate));
      setSuccessMsgAlert(true);
    } else {
      dispatch(createJarInventory(formData));
      setSuccessMsgAlert(true);
    }
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <Navigation />
          <Title title={"Today's Jar Inventory"} />
          <div className={showNavigation ? "beNeutral" : "shiftLeft"}>
            <h2 className="common-heading common-heading-form">
              Today's Jar Count
            </h2>
            <form
              onSubmit={handleJarInventorySubmit}
              className="createForm jarCountForm"
            >
              <div className="fields-wrapper">
                <div className="todaysDate">
                  Date:{" "}
                  {new Date(Date.now()).toLocaleString("en-IN", {
                    month: "short",
                    day: "numeric",
                  })}
                </div>
                {/* Morning */}
                <div className="fields-section">
                  <p>
                    <img src={sun} alt="rate" />
                    Morning:
                  </p>
                  <div className="fields">
                    <label htmlFor="morning.filledJars">
                      <img src={filledJar} alt="rate" />
                      Filled Jars:
                    </label>
                    <input
                      type="number"
                      name="morning.filledJars"
                      placeholder="Morning Filled Jars"
                      value={formData.morning.filledJars}
                      onChange={handleInputChange}
                      min="0"
                    />
                  </div>
                  <div className="fields">
                    <label htmlFor="morning.emptyJars">
                      <img src={emptyJar} alt="rate" />
                      Empty Jars:
                    </label>
                    <input
                      type="number"
                      name="morning.emptyJars"
                      placeholder="Morning Empty Jars"
                      value={formData.morning.emptyJars}
                      onChange={handleInputChange}
                      min="0"
                    />
                  </div>
                </div>

                {/* Trips */}
                <div className="trips-container">
                  {tripCount > 0 &&
                    trips.map((trip, index) => (
                      <>
                        <div key={trip.tripNumber}>
                          <p className="tripNumber">
                            Trip No {trip.tripNumber}
                          </p>
                          <div className="fields">
                            <label htmlFor={`associateName${trip.tripNumber}`}>
                              <img src={Name} alt="zone" />
                              Associate Name:
                            </label>
                            <input
                              name={`trips[${index}].associateName`}
                              value={trip.associateName}
                              onChange={(e) =>
                                handleTripInputChange(
                                  index,
                                  "associateName",
                                  e.target.value
                                )
                              }
                              required
                            />
                          </div>
                          <div style={{ display: "flex" }}>
                            <div className="fields">
                              <label
                                htmlFor={`filledJarsTaken${trip.tripNumber}`}
                              >
                                <img src={filledJar} alt="rate" />
                                <img src={taken} alt="rate" /> Filled Jars
                                Taken:
                              </label>
                              <input
                                type="number"
                                name={`trips[${index}].filledJarsTaken`} // Updated name attribute
                                placeholder="Filled Jars Taken"
                                value={trip.filledJarsTaken}
                                onChange={(e) =>
                                  handleTripInputChange(
                                    index,
                                    "filledJarsTaken",
                                    e.target.value
                                  )
                                }
                                min="0"
                              />
                            </div>
                            <div className="fields">
                              <label
                                htmlFor={`filledJarsBrought${trip.tripNumber}`}
                              >
                                <img src={filledJar} alt="rate" />
                                <img
                                  className="brought"
                                  src={brought}
                                  alt="rate"
                                />{" "}
                                Filled Jars Brought:
                              </label>
                              <input
                                type="number"
                                name={`trips[${index}].filledJarsBrought`}
                                placeholder="Filled Jars Brought"
                                value={trip.filledJarsBrought}
                                onChange={(e) =>
                                  handleTripInputChange(
                                    index,
                                    "filledJarsBrought",
                                    e.target.value
                                  )
                                }
                                min="0"
                              />
                            </div>
                          </div>
                          <div style={{ display: "flex" }}>
                            <div className="fields">
                              <label
                                htmlFor={`emptyJarsTaken${trip.tripNumber}`}
                              >
                                <img src={emptyJar} alt="rate" />
                                <img src={taken} alt="rate" /> Empty Jars Taken:
                              </label>
                              <input
                                type="number"
                                name={`trips[${index}].emptyJarsTaken`}
                                placeholder="Empty Jars Brought"
                                value={trip.emptyJarsTaken}
                                onChange={(e) =>
                                  handleTripInputChange(
                                    index,
                                    "emptyJarsTaken",
                                    e.target.value
                                  )
                                }
                                min="0"
                              />
                            </div>

                            <div className="fields">
                              <label
                                htmlFor={`emptyJarsBrought${trip.tripNumber}`}
                              >
                                <img src={emptyJar} alt="rate" />
                                <img
                                  className="brought"
                                  src={brought}
                                  alt="rate"
                                />{" "}
                                Empty Jars Brought:
                              </label>
                              <input
                                type="number"
                                name={`trips[${index}].emptyJarsBrought`}
                                placeholder="Empty Jars Brought"
                                value={trip.emptyJarsBrought}
                                onChange={(e) =>
                                  handleTripInputChange(
                                    index,
                                    "emptyJarsBrought",
                                    e.target.value
                                  )
                                }
                                min="0"
                              />
                            </div>
                          </div>
                        </div>
                      </>
                    ))}
                </div>
                <div className="trip-ctas">
                  <div
                    className="createTrip"
                    onClick={handleCreateTrip}
                    role="button"
                  >
                    Create New Trip
                  </div>
                  {tripCount > 0 && (
                    <div
                      className="closeTrip"
                      onClick={handleCloseTrip}
                      role="button"
                    >
                      Close Trip
                    </div>
                  )}
                </div>

                {/* End Of Day */}
                <div className="fields-section">
                  <p>
                    <img src={moon} alt="rate" />
                    End Of Day:
                  </p>
                  <div className="fields">
                    <label htmlFor="endOfDay.filledJars">
                      <img src={filledJar} alt="rate" />
                      Filled Jars:
                    </label>
                    <input
                      type="number"
                      name="endOfDay.filledJars"
                      placeholder="Evening Filled Jars"
                      value={formData.endOfDay.filledJars}
                      onChange={handleInputChange}
                      min="0"
                    />
                  </div>
                  <div className="fields">
                    <label htmlFor="endOfDay.emptyJars">
                      <img src={emptyJar} alt="rate" />
                      Empty Jars:
                    </label>
                    <input
                      type="number"
                      name="endOfDay.emptyJars"
                      placeholder="Evening Empty Jars"
                      value={formData.endOfDay.emptyJars}
                      onChange={handleInputChange}
                      min="0"
                    />
                  </div>
                </div>
                <button className="common-cta" type="submit">
                  {update ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </>
  );
};

export default CreateJarsCount;
