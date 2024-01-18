import StockChart from "./chart";
import Input from "./chartDataInput";
import { useState, useEffect } from "react";
import Candlestickchart from "./candlechart";
import { useNavigate } from "react-router-dom";
const ZoomedChart = () => {
  const Navigate = useNavigate();
  // const [call, setCall] = useState(false);
  var currentdate = new Date();
  currentdate = Date.parse(currentdate) + 19800000;
  var lastdate = currentdate - 86400000;
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
    setFormData(input);
  };

  const data = JSON.stringify({
    exchange: "NSE",
    symboltoken: "99926000",
    interval: `${formData.interval}`,
    fromdate: `${formData.fromdate}`,
    todate: `${formData.todate}`,
  });

  const url =
    "https://apiconnect.angelbroking.com/rest/secure/angelbroking/historical/v1/getCandleData";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const Authorization = JSON.parse(localStorage.getItem("Auth"));
        if (!Authorization) {
          Navigate("/");
        }

        const header = {
          "X-PrivateKey": "dSlTjRIK",
          Accept: "application/json",
          "X-SourceID": "WEB",
          "X-ClientLocalIP": "10.30.42.237",
          "X-ClientPublicIP": "14.139.176.131",
          "X-MACAddress": "7A-F1-FE-39-A3-21",
          "X-UserType": "USER",
          Authorization: `Bearer ${Authorization.data.jwtToken}`,
          "Content-Type": "application/json",
          Connection: "keep-alive",
        };

        const response = await fetch(url, {
          method: "POST",
          headers: header,
          body: data,
        });

        console.log("Response status:", response.status, response.statusText);

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const Data = await response.json();
        console.log(Data);

        // Assuming setCandle and transformData are defined elsewhere
        setCandle(transformData(Data));
      } catch (error) {
        console.error(
          "There was a problem with the fetch operation:",
          error.message
        );
      }
    };

    fetchData();
  }, [formData]);

  return (
    <div className="market-chat dashboard-body-divs">
      <Input sendChartInputData={receiveChartInputData} />
      {/* <StockChart
        candlestickData={candle}
        interval={formData.interval}
        className="chart"
      /> */}
      <Candlestickchart priceData={candle} className="chart" />
    </div>
  );
};
export default ZoomedChart;
