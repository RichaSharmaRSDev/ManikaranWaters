import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../layout/Loader/Loader";
import Navigation from "../Navigation/Navigation";
import { useAlert } from "react-alert";
import emptyJar from "../../assets/emptyJar.png";
import filledJar from "../../assets/filledJar.png";
import Title from "../layout/Title";
import taken from "../../assets/truck-container.svg";
import brought from "../../assets/truck-container-empty.svg";
import {
  InventoryForDate,
  InventoryForMonth,
} from "../../actions/jarCountAction";
import "./AllJars.scss";

const AllJarsCount = () => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.user);
  const { showNavigation } = useSelector((state) => state.navigation);
  const {
    loading,
    error,
    success,
    jarForDay,
    highestTripCount,
    jarForMonth,
    successMonth,
  } = useSelector((state) => state.jars) || {};
  const [date, setDate] = useState(formatDate(new Date(Date.now())));

  const currentDate = new Date();
  currentDate.setUTCHours(0, 0, 0, 0); // Set UTC midnight time
  const currentYear = currentDate.getUTCFullYear();
  const currentMonth = currentDate.getUTCMonth();
  const daysInMonth = (year, month) => {
    return new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  };
  const totalDays = daysInMonth(currentYear, currentMonth);
  const startDate = new Date(Date.UTC(currentYear, currentMonth, 1));
  const endDate = new Date(Date.UTC(currentYear, currentMonth, totalDays));

  const dates = [];
  const currentDatePointer = new Date(startDate);

  while (currentDatePointer <= endDate) {
    dates.push(currentDatePointer.toISOString());
    currentDatePointer.setUTCDate(currentDatePointer.getUTCDate() + 1);
  }

  function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  function shortDate(date) {
    const options = { month: "short", day: "2-digit" };
    const date1 = new Date(date);
    return date1.toLocaleDateString("en-IN", options);
  }

  const alert = useAlert();
  // const handleDateChange = (date) => {
  //   setDate(date);
  //   const customInventoryDate = new Date(date);
  //   inventoryDate = formatDate(customInventoryDate);
  //   dispatch(InventoryForDate(inventoryDate));
  // };

  useEffect(() => {
    dispatch(InventoryForMonth((currentMonth + 1).toString().padStart(2, "0")));
  }, []);

  return (
    <>
      <Title title={"Jar Details"} />
      <Navigation />
      {loading ? (
        <Loader />
      ) : (
        <>
          <div className={showNavigation ? "beNeutral" : "shiftLeft"}>
            <div className="jarContentContainer">
              {successMonth && (
                <div className="results">
                  <table>
                    <thead className="jars-list-header">
                      <tr>
                        <th>Date</th>
                        <th>Morning</th>
                        <th>EndOfDay</th>
                        <th>Diff</th>
                        {Array.from(
                          { length: highestTripCount },
                          (_, index) => (
                            <th>Trip {index + 1}</th>
                          )
                        )}
                        <th>Cumul.</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dates?.map((day, index) => (
                        <tr key={index}>
                          <td>{shortDate(day)}</td>
                          {jarForMonth
                            .filter((i) => i.date == day)
                            .map((perDay) => {
                              return (
                                <>
                                  <td>
                                    <img src={filledJar} alt="rate" />:{" "}
                                    {perDay?.morning?.filledJars}
                                    {" | "}
                                    <img src={emptyJar} alt="rate" />:{" "}
                                    {perDay?.morning?.emptyJars}
                                  </td>
                                  <td>
                                    <img src={emptyJar} alt="rate" />:{" "}
                                    {perDay?.endOfDay?.emptyJars}
                                    {" | "}
                                    <img src={filledJar} alt="rate" />:{" "}
                                    {perDay?.endOfDay?.filledJars}
                                  </td>
                                  <td
                                    className={`${
                                      perDay.dayDifference >= 0
                                        ? "success"
                                        : "error"
                                    }`}
                                  >
                                    {perDay.dayDifference}
                                  </td>
                                  {Array.from(
                                    { length: highestTripCount },
                                    (_, index) => (
                                      <td key={index}>
                                        {perDay?.trips[index]
                                          ?.filledJarsTaken != null && (
                                          <>
                                            {
                                              perDay?.trips[index]
                                                ?.associateName
                                            }
                                            {" | "}
                                            <img src={taken} alt="rate" />:{" "}
                                            {perDay?.trips[index]
                                              ?.filledJarsTaken +
                                              perDay?.trips[index]
                                                ?.emptyJarsTaken}
                                            {" | "}
                                            <img
                                              style={{
                                                transform: "scaleX(-1)",
                                              }}
                                              src={brought}
                                              alt="rate"
                                            />
                                            :{" "}
                                            {perDay?.trips[index]
                                              ?.emptyJarsBrought +
                                              perDay?.trips[index]
                                                ?.filledJarsBrought}
                                            {" | "}
                                            <span
                                              className={`${
                                                perDay?.trips[index]
                                                  ?.difference >= 0
                                                  ? "success"
                                                  : "error"
                                              }`}
                                            >
                                              {perDay?.trips[index].difference}
                                            </span>
                                          </>
                                        )}
                                      </td>
                                    )
                                  )}
                                  <td
                                    className={`${
                                      perDay.tillDateDifference >= 0
                                        ? "success"
                                        : "error"
                                    }`}
                                  >
                                    {perDay.tillDateDifference}
                                  </td>
                                </>
                              );
                            })}
                          {jarForMonth.filter((i) => i.date === day).length ===
                            0 && (
                            <>
                              <td></td>
                              <td></td>
                              <td></td>
                              {Array.from(
                                { length: highestTripCount },
                                (_, index) => (
                                  <td key={index}></td>
                                )
                              )}
                              <td></td>
                            </>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {error && (
                <div className="noResults">
                  <span>{error}</span>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default AllJarsCount;
