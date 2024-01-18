// import { useState } from "react";
// import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Login = () => {
  const navigate = useNavigate();

  const apiKey = "9f7a801a3040479d8d9199cd68c630a8";
  const url = `https://login.paytmmoney.com/merchant-login?apiKey=${apiKey}&state=prateeksingh`;
  const url_token = "http://localhost:5000/token";
  // const url_token_test = "https://localhost:5000/token";
  const apiSecretKey = "256fc35a33034b20bad10ace13141769";
  const handleClick = async () => {
    // console.log("ha bhai aa gaya");
    try {
      window.location.href = url;
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    // Parse query parameters from the URL
    const queryParams = new URLSearchParams(window.location.search);
    const isSuccess = queryParams.get("success");

    if (isSuccess === "true") {
      console.log(isSuccess);
      const requestToken = queryParams.get("requestToken");
      console.log(requestToken);
      const fetchdata = async () => {
        try {
          const token = await fetch(url_token, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              api_key: apiKey,
              api_secret_key: apiSecretKey,
              request_token: requestToken,
            }),
          });
          const response = await token.json();
          localStorage.setItem("users", JSON.stringify(response));

          console.log(response);
        } catch (error) {
          console.log(error);
        }
      };

      fetchdata();
    } else {
      console.log("Not successful.");
    }
    const users = localStorage.getItem("users");
    if (users) {
      navigate("/Signin");
    }
  }, [url_token]);

  return (
    <div className="login">
      <button onClick={handleClick} className="bn632-hover bn23">
        Login
      </button>
    </div>
  );
};
export default Login;
