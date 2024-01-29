import "../editor.css";
import { LiaClipboardListSolid } from "react-icons/lia";
import { MdNavigateNext } from "react-icons/md";
import VerticalLine from "./vertical-line";
import Fund from "./fund";
import Position from "./position";
import { useEffect, useState } from "react";
import Input from "./chartDataInput";
import Candlestickchart from "./candlechart";

// import { Navigate } from "react-router-dom";
// import { authenticator } from "otplib";
import { useNavigate } from "react-router-dom";

export default function Editor(props) {
  const Navigate = useNavigate();
  // const date = new Date();
  var currentdate = new Date();
  currentdate = Date.parse(currentdate) + 19800000;
  var lastdate = currentdate - 259200000;
  currentdate = new Date(currentdate);
  lastdate = new Date(lastdate);
  lastdate = lastdate.toISOString().replace("T", " ").slice(0, 16);
  currentdate = currentdate.toISOString().replace("T", " ").slice(0, 16);

  const [candle, setCandle] = useState([]);
  const [formData, setFormData] = useState({
    interval: "FIVE_MINUTE",
    fromdate: lastdate,
    todate: currentdate,
  });

  const transformData = (inputData) => {
    return inputData.data.map((item) => {
      const tradetime = (Date.parse(item[0]) + 19800000) / 1000;
      return {
        time: tradetime,
        open: item[1],
        high: item[2],
        low: item[3],
        close: item[4],
      };
    });
  };

  const receiveChartInputData = (input) => {
    console.log(input);
    if (!input.fromdate || !input.todate) {
      setFormData((prev) => {
        return {
          ...prev,
          interval: input.interval,
          fromdate: lastdate,
          todate: currentdate,
        };
      });
    } else {
      setFormData(input);
    }

    // console.log(formData);
  };

  var data = JSON.stringify({
    exchange: "NSE",
    // symboltoken: "77567",
    symboltoken: "99926000",
    interval: `${formData.interval}`,
    fromdate: `${formData.fromdate}`,
    todate: `${formData.todate}`,
  });

  const url =
    "https://apiconnect.angelbroking.com/rest/secure/angelbroking/historical/v1/getCandleData";

  useEffect(() => {
    const Authorization = JSON.parse(localStorage.getItem("Auth"));
    if (!Authorization) {
      Navigate("/");
    }

    const header = {
      "X-PrivateKey": "dSlTjRIK",
      Accept: "application/json",
      "X-SourceID": "WEB",
      "X-ClientLocalIP": "10.30.47.95",
      "X-ClientPublicIP": "14.139.176.131",
      "X-MACAddress": "7A-F1-FE-39-A3-21",
      "X-UserType": "USER",
      Authorization: `Bearer ${Authorization.data.jwtToken}`,
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
        // Data = JSON.stringify(Data);
        // console.log(Data);
        setCandle(transformData(Data));

        // console.log(candle);
      })
      .catch(function (error) {
        console.error(
          "There was a problem with the fetch operation:",
          error.message
        );
        localStorage.removeItem("Auth");
        // Navigate("/Signin");
      });
  }, [formData]);
  const receiveltp = (input) => {
    console.log(input);
    // return input;

    props.sendltp(input);
  };

  return (
    <div className="dashboard-body">
      {/* <h1>Component A</h1> */}
      <div className="portfolio-summary dashboard-body-divs">
        <div className="portfolio-summary-heading">
          <LiaClipboardListSolid className="portfolio-summary-heading-logo" />
          <span className="portfolio-summary-heading-html">
            Portfolio Summary
          </span>
          <MdNavigateNext className="portfolio-summary-heading-logo-next" />
        </div>
        <div className="portfolio-summary-data">
          <div className="portfolio-summary-data-total_investment portfolio-summary-common">
            <div>Total Investment</div>
            <div>&#8377; 0.00</div>
          </div>
          <VerticalLine />
          <div className="portfolio-summary-data-current_vlaue portfolio-summary-common">
            <div>Current Value</div>
            <div>&#8377; 0.00</div>
          </div>
          <VerticalLine />
          <div className="portfolio-summary-data-overall_returns portfolio-summary-common">
            <div>Overall Returns</div>
            <div>&#8377; 0.00 (0.00%)</div>
          </div>
        </div>
      </div>
      <div className="fund-position">
        <Fund />
        <Position />
      </div>
      <div className="market-chat dashboard-body-divs">
        <Input sendChartInputData={receiveChartInputData} />
        <Candlestickchart
          priceData={candle}
          sendltp={receiveltp}
          className="chart"
        />
      </div>
    </div>
  );
}
