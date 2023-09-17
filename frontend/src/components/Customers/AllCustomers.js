import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  clearErrors,
  getAllCustomersBasicDetails,
} from "../../actions/customerAction";
import Loader from "../layout/Loader/Loader";
import { Navigate } from "react-router-dom";
import Navigation from "../Navigation/Navigation";
import { useAlert } from "react-alert";
import "./Table.scss";
import CustomerTable from "./CustomerTable";
import Title from "../layout/Title";
import { Pagination } from "../layout/Pagination/Pagination";

const Customers = () => {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const { customers, loading, error, successBasic, customersCount } =
    useSelector((state) => state.customers);
  const { isAuthenticated } = useSelector((state) => state.user);
  const { showNavigation } = useSelector((state) => state.navigation);
  const totalPages = Math.ceil(customersCount / 20);
  const alert = useAlert();
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  useEffect(() => {
    dispatch(getAllCustomersBasicDetails(currentPage));
  }, [currentPage]);
  useEffect(() => {
    if (successBasic) {
      alert.success("Reterived data successfully.");
    }
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    if (isAuthenticated === false) {
      Navigate("/");
    }
  }, [successBasic, error, alert, dispatch, isAuthenticated]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <Title title={"Customer Details"} />
          <Navigation />
          <div className={showNavigation ? "beNeutral" : "shiftLeft"}>
            <h2 className="common-heading">Customers List</h2>
            <CustomerTable customers={customers} />
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </div>
        </>
      )}
    </>
  );
};

export default Customers;
