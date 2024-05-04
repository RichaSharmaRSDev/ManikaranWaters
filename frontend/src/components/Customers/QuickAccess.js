import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../components/layout/Loader/Loader.js";
import Navigation from "../Navigation/Navigation";
import Title from "../layout/Title.js";
import { getCustomersIdName } from "../../actions/customerAction";

const QuickAccess = () => {
  // // const alert = useAlert();
  const { showNavigation } = useSelector((state) => state.navigation);
  const dispatch = useDispatch();
  const {
    loading,
    customersIdName,
    error: customerError,
  } = useSelector((state) => state.customers);
  const { isAuthenticated } = useSelector((state) => state.user);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getCustomersIdName());
    }
  }, []);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <Title title={"Quick Access"} />
          <Navigation />
          <div className={showNavigation ? "beNeutral" : "shiftLeft"}>
            <h2 className="common-heading common-heading-form">Quick Access</h2>
            {customersIdName ? (
              <div className="quickaccess-parent customer-list">
                <table>
                  <thead className="customer-list-header">
                    <tr>
                      <th className="customer-id">ID</th>
                      <th className="customer-name">Name</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customersIdName?.map((i) => (
                      <>
                        <tr>
                          <td>{i?.customerId}</td>
                          <td>{i?.name}</td>
                        </tr>
                      </>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              `no data ${customerError}`
            )}
          </div>
        </>
      )}
    </>
  );
};

export default QuickAccess;
