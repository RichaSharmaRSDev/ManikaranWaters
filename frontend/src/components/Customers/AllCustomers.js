import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  clearErrors,
  getAllCustomersBasicDetails,
} from "../../actions/customerAction";
import Loader from "../layout/Loader/Loader";
import { Navigate, useSearchParams } from "react-router-dom";
import Navigation from "../Navigation/Navigation";
// // import { useAlert } from "react-alert";
import "./Table.scss";
import CustomerTable from "./CustomerTable";
import Title from "../layout/Title";
import { Pagination } from "../layout/Pagination/Pagination";

const Customers = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get("page")) || 1;
  useEffect(() => {
    if (!searchParams.get("page")) {
      setSearchParams({ page: 1 }, { replace: true });
    }
  }, []);
  const { customers, loading, error, successBasic, customersCount } =
    useSelector((state) => state.customers);
  const { isAuthenticated } = useSelector((state) => state.user);
  const { showNavigation } = useSelector((state) => state.navigation);
  const totalPages = Math.ceil(customersCount / 20);
  // // const alert = useAlert();
  const handlePageChange = (page) => {
    setSearchParams({ page });
    window.scrollTo(0, 0);
  };
  useEffect(() => {
    dispatch(getAllCustomersBasicDetails(currentPage));
  }, [currentPage]);
  useEffect(() => {
    if (successBasic) {
      console.log("Reterived data successfully.");
    }
    if (error) {
      console.log(error);
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
              <>
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
                <span style={{ fontSize: "12px", color: "#7a8fa6" }}>
                  Page {currentPage} of {totalPages}
                </span>
              </>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default Customers;
