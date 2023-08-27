import React, { useEffect } from "react";
import { clearErrors, frequencyCustomers } from "../../actions/customerAction";
import { useDispatch, useSelector } from "react-redux";
import Navigation from "../Navigation/Navigation";
import Loader from "../layout/Loader/Loader";
import "./Customers.scss";
import { useAlert } from "react-alert";

const FrequencyCustomers = () => {
  const { showNavigation } = useSelector((state) => state.navigation);
  const { loading, customers, successfrequency, error } = useSelector(
    (state) => state.customers
  );
  const alert = useAlert();
  const dispatch = useDispatch();

  useEffect(() => {
    if (successfrequency === true) {
      alert.success("Reterived data successfully.");
    }
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
  }, [successfrequency, error, alert, dispatch]);

  const handleClick = (days) => {
    dispatch(frequencyCustomers(days));
  };
  return (
    <>
      <Navigation />
      <div className={showNavigation ? "beNeutral" : "shiftLeft"}>
        <h2 className="common-heading">Customer Frequency Insights</h2>
        <div className="customer-frequency-container">
          <div className="frequency-cta-wrapper">
            <button
              className="common-cta common-cta-blue"
              onClick={() => handleClick(1)}
            >
              Daily Customers
            </button>
            <button
              className="common-cta common-cta-blue"
              onClick={() => handleClick(2)}
            >
              Alternate Day Customers
            </button>
            <button
              className="common-cta common-cta-blue"
              onClick={() => handleClick(3)}
            >
              Ternary Customers
            </button>
            <button
              className="common-cta common-cta-blue"
              onClick={() => handleClick(3)}
            >
              Custom Interval Customers
            </button>
          </div>
        </div>
        <>{successfrequency && <>success</>}</>
      </div>
    </>
  );
};

export default FrequencyCustomers;
