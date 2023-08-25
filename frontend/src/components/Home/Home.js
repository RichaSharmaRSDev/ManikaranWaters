import React, { useEffect } from "react";
import Title from "../layout/Title";
import { getCustomers } from "../../actions/customerAction";
import { useSelector, useDispatch } from "react-redux";
import LoginSignUp from "../User/LoginSignUp";

const Home = () => {
  // const dispatch = useDispatch();
  // useEffect(() => {
  //   dispatch(getCustomers());
  // }, [dispatch]);
  return (
    <>
      <Title title="HomePage" />
      <h1>HomePage</h1>
    </>
  );
};

export default Home;
