import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getCustomers } from "../../actions/customerAction";

const CreateCustomer = () => {
  const [data, setData] = useState(null); // Fix here
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      const result = await dispatch(getCustomers());
      setData(result);
    };
    fetchData();
  }, [dispatch]);

  return <>{data}</>;
};

export default CreateCustomer;
