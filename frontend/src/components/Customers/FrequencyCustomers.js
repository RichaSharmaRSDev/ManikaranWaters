import React, { useEffect } from "react";
import { clearErrors, frequencyCustomers } from "../../actions/customerAction";
import { useDispatch, useSelector } from "react-redux";
import Navigation from "../Navigation/Navigation";
import Loader from "../layout/Loader/Loader";
import "./Table.scss";
// // import { useAlert } from "react-alert";
import { useParams, useSearchParams } from "react-router-dom";
import { Pagination } from "../layout/Pagination/Pagination";
import Title from "../layout/Title";
import HabitsCustomerTable from "./HabitsCustomerTable";

const FrequencyCustomers = () => {
  const { input } = useParams();
  const { showNavigation } = useSelector((state) => state.navigation);
  const { loading, customers, successfrequency, error, customerFeatureCount } =
    useSelector((state) => state.customers);
  // const alert = useAlert();
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get("page")) || 1;
  useEffect(() => {
    if (!searchParams.get("page")) {
      setSearchParams({ page: 1 }, { replace: true });
    }
  }, []);
  const totalPages = Math.ceil(customerFeatureCount / 20);
  const handlePageChange = (page) => {
    setSearchParams({ page });
    window.scrollTo(0, 0);
  };
  useEffect(() => {
    setSearchParams({ page: 1 });
  }, [input]);

  useEffect(() => {
    dispatch(frequencyCustomers(input, currentPage));
  }, [input, currentPage]);
  useEffect(() => {
    if (successfrequency === true) {
      console.log("Reterived data successfully.");
    }
    if (error) {
      console.log(error);
      dispatch(clearErrors());
    }
  }, [successfrequency, error]);

  return (
    <>
      <Navigation />
      <Title title={"Customer Frequency"} />
      <div className={showNavigation ? "beNeutral" : "shiftLeft"}>
        <h2 className="common-heading">Customer Frequency Insights</h2>
        <div className="customer-frequency-container"></div>
        <>
          {loading && <Loader />}
          {successfrequency && (
            <>
              <HabitsCustomerTable
                customers={customers}
                frequencyField={false}
              />
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
            </>
          )}
        </>
      </div>
    </>
  );
};

export default FrequencyCustomers;
