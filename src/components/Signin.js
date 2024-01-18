import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// import "./SignInForm.css"; // Import the CSS file

const SignInForm = () => {
  const [clientId, setClientId] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const Navigate = useNavigate();
  useEffect(() => {
    const Auth = localStorage.getItem("Auth");
    if (Auth) {
      Navigate("/dashboard");
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Perform sign-in logic here, such as sending the data to a server for verification
    // Example: Logging the input values to the console
    console.log("Client ID:", clientId);
    console.log("Password:", password);
    console.log("OTP:", otp);
    var data = JSON.stringify({
      //   clientcode: "P51346239",
      clientcode: `${clientId}`,
      password: `${password}`,
      totp: `${otp}`,
    });

    const url =
      "https://apiconnect.angelbroking.com//rest/auth/angelbroking/user/v1/loginByPassword";
    const header = {
      "X-PrivateKey": "dSlTjRIK",
      Accept: "application/json",
      "X-SourceID": "WEB",
      "X-ClientLocalIP": "10.30.42.237",
      "X-ClientPublicIP": "14.139.176.131",
      "X-MACAddress": "7A-F1-FE-39-A3-21",
      "X-UserType": "USER",
      "Content-Type": "application/json",
      Connection: "keep-alive",
    };
    fetch(url, {
      method: "POST",
      headers: header,
      body: data,
    })
      .then(function (response) {
        console.log("Response status:", response.status, response.statusText);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then(function (Data) {
        console.log(Data);
        Data = JSON.stringify(Data);
        localStorage.setItem("Auth", Data);
        Navigate("/Dashboard");
      })
      .catch(function (error) {
        console.error(
          "There was a problem with the fetch operation:",
          error.message
        );
      });

    // You can add your authentication logic and API calls here
  };

  return (
    <form className="sign-in-form" onSubmit={handleSubmit} id="SignInForm">
      <label>
        Client ID:
        <input
          type="text"
          value={clientId}
          onChange={(e) => setClientId(e.target.value)}
          className="input-field"
          name="Client ID"
        />
      </label>
      <br />
      <label>
        Password:
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input-field"
          name="Password"
        />
      </label>
      <br />
      <label>
        OTP:
        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="input-field"
          name="OTP"
        />
      </label>
      <br />
      <button type="submit" className="sign-in-button">
        Sign In
      </button>
    </form>
  );
};

export default SignInForm;
