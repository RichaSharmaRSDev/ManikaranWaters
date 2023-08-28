import React, { useEffect, useState } from "react";
import { clearErrors, frequencyCustomers } from "../../actions/customerAction";
import { useDispatch, useSelector } from "react-redux";
import Navigation from "../Navigation/Navigation";
import Loader from "../layout/Loader/Loader";
import "./Customers.scss";
import { useAlert } from "react-alert";
import CustomerTable from "./CustomerTable";
import { useParams } from "react-router-dom";
import { Pagination } from "../layout/Pagination/Pagination";

const FrequencyCustomers = () => {
  const { input } = useParams();
  const { showNavigation } = useSelector((state) => state.navigation);
  const { loading, customers, successfrequency, error } = useSelector(
    (state) => state.customers
  );
  const alert = useAlert();
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  useEffect(() => {
    dispatch(frequencyCustomers(input, currentPage));
  }, [input]);
  useEffect(() => {
    if (successfrequency === true) {
      alert.success("Reterived data successfully.");
    }
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
  }, [successfrequency, error]);

  return (
    <>
      <Navigation />
      <div className={showNavigation ? "beNeutral" : "shiftLeft"}>
        <h2 className="common-heading">Customer Frequency Insights</h2>
        <div className="customer-frequency-container"></div>
        <>
          {loading && <Loader />}
          {successfrequency && (
            <>
              <CustomerTable customers={customers} />
              <Pagination
                currentPage={currentPage}
                totalPages={10}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </>
      </div>
    </>
  );
};

export default FrequencyCustomers;
