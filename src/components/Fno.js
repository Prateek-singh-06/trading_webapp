import React, { useEffect, useState } from "react";
import Split from "react-split";
import Optionchain from "./Optionchain";
import FnoOverview from "./FnoOverview";

const StockMarketStream = () => {
  const [LTP, setLTP] = useState(null);
  const [config, setconfig] = useState();
  const [Indices, setIndices] = useState("NIFTY");
  const users = JSON.parse(localStorage.getItem("users"));

  useEffect(() => {
    const fetchdata = async () => {
      try {
        const response = await fetch("http://localhost:5000/fno/config", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-jwt-token": users.read_access_token,
          },
          body: JSON.stringify({
            symbol: "NIFTY",
          }),
        });
        const result = await response.json();
        setconfig(result);
      } catch (err) {
        console.log(err);
      }
    };
    fetchdata();
  }, []);

  function receiveltp(input) {
    console.log(input);
    setLTP(input);
  }
  function receiveIndices(input) {
    console.log(input);
    setIndices(input);
  }
  function receiveconfig(input) {
    console.log(input);
    setconfig(input);
  }

  return (
    <div className="fno">
      <Split sizes={[40, 60]} direction="horizontal" className="split">
        <Optionchain LTP={LTP} Indices={Indices} config={config} />
        <FnoOverview
          sendltp={receiveltp}
          sendIndices={receiveIndices}
          sendconfig={receiveconfig}
        />
      </Split>
    </div>
  );
};

export default StockMarketStream;
