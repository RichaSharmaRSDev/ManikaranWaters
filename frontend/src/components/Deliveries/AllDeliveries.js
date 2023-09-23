import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { allDeliveries, clearErrors } from "../../actions/deliveryAction";
import Loader from "../layout/Loader/Loader";
import { useLocation } from "react-router-dom";
import Navigation from "../Navigation/Navigation";
// import { useAlert } from "react-alert";
import Title from "../layout/Title";
import { Pagination } from "../layout/Pagination/Pagination";
import DeliveryTable from "./DeliveryTable";

const AllDeliveries = () => {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);

  const { isAuthenticated } = useSelector((state) => state.user);
  const { showNavigation } = useSelector((state) => state.navigation);
  const { deliveries, deliveryCount, deliveryTotal, success, error, loading } =
    useSelector((state) => state.deliveries) || {};
  const totalPages = Math.ceil(deliveryCount / 20);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const deliveryDateText = queryParams.get("deliveryDate");

  function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  let deliveryDate;

  if (deliveryDateText === "today") {
    const today = new Date(Date.now());
    deliveryDate = formatDate(today);
  } else if (deliveryDateText === "yesterday") {
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
    deliveryDate = formatDate(yesterday);
  } else {
    const customDeliveryDate = new Date(deliveryDateText);
    deliveryDate = formatDate(customDeliveryDate);
  }

  // const alert = useAlert();
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  useEffect(() => {
    dispatch(allDeliveries(deliveryDate, currentPage));
  }, [deliveryDate, currentPage]);
  useEffect(() => {
    if (success) {
      console.log("Received Deliveries Successfully.");
    }
    if (error) {
      console.log(error);
      dispatch(clearErrors());
    }
  }, [success, error]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <Title title={"Delivery Details"} />
          <Navigation />
          <div className={showNavigation ? "beNeutral" : "shiftLeft"}>
            {deliveries?.length ? (
              <>
                <h2 className="common-heading">
                  Deliveries for{" "}
                  {deliveryDateText.charAt(0).toUpperCase() +
                    deliveryDateText.slice(1)}
                </h2>
                <DeliveryTable
                  deliveries={deliveries}
                  deliveryTotal={deliveryTotal}
                />
                {totalPages > 1 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                )}
              </>
            ) : (
              <div className="noResults">
                <span>No deliveries available for {deliveryDateText}</span>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default AllDeliveries;
