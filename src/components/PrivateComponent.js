import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const PrivateComponent = () => {
  const Auth = localStorage.getItem("users");
  return Auth ? <Outlet /> : <Navigate to="/" />;
};

export default PrivateComponent;
