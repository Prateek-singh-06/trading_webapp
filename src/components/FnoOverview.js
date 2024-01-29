import "../editor.css";
import { useEffect, useState } from "react";
import Input from "./chartDataInput";
import Candlestickchart from "./candlechart";
import Optioncard from "./Optioncard";

// import { Navigate } from "react-router-dom";
// import { authenticator } from "otplib";
import { useNavigate } from "react-router-dom";

export default function Editor(props) {
  const Navigate = useNavigate();
  const [LTP, setLTP] = useState([
    {
      Nifty50: null,
      changeAbsolute: null,
      changePercent: null,
    },
    {
      Banknifty: null,
      changeAbsolute: null,
      changePercent: null,
    },
    {
      Finnifty: null,
      changeAbsolute: null,
      changePercent: null,
    },
    {
      Midcap: null,
      changeAbsolute: null,
      changePercent: null,
    },
  ]);
  const publicAccessToken = JSON.parse(
    localStorage.getItem("users")
  ).public_access_token;
  // const date = new Date();
  var currentdate = new Date();
  currentdate = Date.parse(currentdate) + 19800000;
  var lastdate = currentdate - 518400000;
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
    props.sendltp(input);
  };
  const receiveIndices = (input) => {
    console.log(input);
    props.sendIndices(input);
  };
  const receiveconfig = (input) => {
    console.log(input);
    props.sendconfig(input);
  };

  useEffect(() => {
    // console.log(publicAccessToken);
    const socket = new WebSocket(
      `wss://developer-ws.paytmmoney.com/broadcast/user/v1/data?x_jwt_token=${publicAccessToken}`
    );
    socket.addEventListener("open", (event) => {
      console.log("connected");
      if (socket.readyState === socket.OPEN) {
        socket.send(
          JSON.stringify([
            {
              actionType: "ADD",
              modeType: "LTP",
              scripType: "INDEX",
              exchangeType: "NSE",
              scripId: "13",
            },
            {
              actionType: "ADD",
              modeType: "LTP",
              scripType: "INDEX",
              exchangeType: "NSE",
              scripId: "25",
            },
            {
              actionType: "ADD",
              modeType: "LTP",
              scripType: "INDEX",
              exchangeType: "NSE",
              scripId: "27",
            },
            {
              actionType: "ADD",
              modeType: "LTP",
              scripType: "INDEX",
              exchangeType: "NSE",
              scripId: "442",
            },
          ])
        );
      }
    });

    socket.addEventListener("message", async function (message) {
      try {
        if (message.data instanceof Blob) {
          processByteMessage(message);
        } else {
          console.log("Message: " + message.data);
        }
      } catch (e) {
        console.log("Error: " + e);
      }
    });

    function processByteMessage(message) {
      const arrayBufferPromise = message.data.arrayBuffer();
      arrayBufferPromise.then((data) => {
        var l = data.byteLength;
        var dvu = new DataView(data);
        let position = 0;
        while (position !== l) {
          var type = dvu.getInt8(position);
          position = position + 1;
          console.log("Mode Type: " + type);
          switch (type) {
            case 64:
              console.log("IndexLtpPacket");
              processIndexLtpPacket(dvu);
              break;
            case 65:
              console.log("IndexQuotePacket");
              processIndexQuotePacket(dvu);
              break;
            case 66:
              console.log("IndexFullPacket");
              processIndexFullPacket(dvu);
              break;
            case 61:
              console.log("LtpPacket");
              processLtpPacket(dvu);
              break;
            case 62:
              console.log("QuotePacket");
              processQuotePacket(dvu);
              break;
            case 63:
              console.log("FullPacket");
              processFullPacket(dvu);
              break;
            default:
              console.log("Default");
              break;
          }
        }

        function processLtpPacket(dvu) {
          console.log("last_trade_price: " + dvu.getFloat32(position, true));
          console.log("last_trade_time: " + dvu.getInt32(position + 4, true));
          console.log("security id: " + dvu.getInt32(position + 8, true));
          console.log("traded: " + dvu.getInt8(position + 12, true));
          console.log("Mode: " + dvu.getInt8(position + 13, true));
          console.log("changeAbsolute: " + dvu.getFloat32(position + 14, true));
          console.log("changePercent: " + dvu.getFloat32(position + 18, true));
          position += 22;
        }

        function processIndexLtpPacket(dvu) {
          const id = dvu.getInt32(position + 8, true);
          const ltp = dvu.getFloat32(position, true);
          const changeAbsolute = dvu.getFloat32(position + 14, true);
          const changePercent = dvu.getFloat32(position + 18, true);
          if (id === 13) {
            setLTP((prevState) => [
              {
                ...prevState[0],
                Nifty50: ltp,
                changeAbsolute: changeAbsolute,
                changePercent: changePercent,
              },
              ...prevState.slice(1),
            ]);
          } else if (id === 25) {
            setLTP((prevState) => [
              ...prevState.slice(0, 1),
              {
                ...prevState[1],
                Banknifty: ltp,
                changeAbsolute: changeAbsolute,
                changePercent: changePercent,
              },
              ...prevState.slice(2),
            ]);
          } else if (id === 27) {
            setLTP((prevState) => [
              ...prevState.slice(0, 2),
              {
                ...prevState[2],
                Finnifty: ltp,
                changeAbsolute: changeAbsolute,
                changePercent: changePercent,
              },
              ...prevState.slice(3),
            ]);
          } else {
            setLTP((prevState) => [
              ...prevState.slice(0, 3),
              {
                ...prevState[3],
                Midcap: ltp,
                changeAbsolute: changeAbsolute,
                changePercent: changePercent,
              },
              // ...prevState.slice(4),
            ]);
          }

          // console.log("last_trade_price: " + dvu.getFloat32(position, true));
          // console.log("last_update_time: " + dvu.getInt32(position + 4, true));
          // console.log("security id: " + dvu.getInt32(position + 8, true));
          // console.log("traded: " + dvu.getInt8(position + 12, true));
          // console.log("Mode: " + dvu.getInt8(position + 13, true));
          // console.log("changeAbsolute: " + dvu.getFloat32(position + 14, true));
          // console.log("changePercent: " + dvu.getFloat32(position + 18, true));
          position += 22;
        }

        function processQuotePacket(dvu) {
          console.log("last_traded_price: " + dvu.getFloat32(position, true));
          console.log("Last_trade_time: " + dvu.getInt32(position + 4, true));
          console.log("security id: " + dvu.getInt32(position + 8, true));
          console.log("traded: " + dvu.getInt8(position + 12, true));
          console.log("Mode: " + dvu.getInt8(position + 13, true));
          console.log(
            "last_traded_quantity " + dvu.getInt32(position + 14, true)
          );
          console.log(
            "average_traded_price: " + dvu.getFloat32(position + 18, true)
          );
          console.log("volume: " + dvu.getInt32(position + 22, true));
          console.log(
            "total_buy_quantity: " + dvu.getInt32(position + 26, true)
          );
          console.log(
            "total_sell_quantity: " + dvu.getInt32(position + 30, true)
          );
          console.log("open: " + dvu.getFloat32(position + 34, true));
          console.log("close: " + dvu.getFloat32(position + 38, true));
          console.log("high: " + dvu.getFloat32(position + 42, true));
          console.log("low: " + dvu.getFloat32(position + 46, true));
          console.log("change_percent: " + dvu.getFloat32(position + 50, true));
          console.log(
            "change_absolute: " + dvu.getFloat32(position + 54, true)
          );
          console.log("52_week_high: " + dvu.getFloat32(position + 58, true));
          console.log("52_week_low: " + dvu.getFloat32(position + 62, true));
          position += 66;
        }

        function processIndexQuotePacket(dvu) {
          console.log("last_trade_price: " + dvu.getFloat32(position, true));
          console.log("security id: " + dvu.getInt32(position + 4, true));
          console.log("traded: " + dvu.getInt8(position + 8, true));
          console.log("Mode: " + dvu.getInt8(position + 9, true));
          console.log("open " + dvu.getFloat32(position + 10, true));
          console.log("close: " + dvu.getFloat32(position + 14, true));
          console.log("high: " + dvu.getFloat32(position + 18, true));
          console.log("low: " + dvu.getFloat32(position + 22, true));
          console.log("change_percent: " + dvu.getFloat32(position + 26, true));
          console.log(
            "change_absolute: " + dvu.getFloat32(position + 30, true)
          );
          console.log("52_week_high: " + dvu.getFloat32(position + 34, true));
          console.log("52_week_low: " + dvu.getFloat32(position + 38, true));
          position += 42;
        }

        function processFullPacket(dvu) {
          let depthPosition = position;
          for (let i = 0; i < 5; i++) {
            console.log("DEPTH PACKET  #" + (i + 1));
            console.log("buy_quantity: " + dvu.getInt32(depthPosition, true));
            console.log(
              "sell_quantity: " + dvu.getInt32(depthPosition + 4, true)
            );

            console.log("buy_order: " + dvu.getInt16(depthPosition + 8, true));
            console.log(
              "sell_order: " + dvu.getInt16(depthPosition + 10, true)
            );

            console.log(
              "buy_price: " + dvu.getFloat32(depthPosition + 12, true)
            );
            console.log(
              "sell_price: " + dvu.getFloat32(depthPosition + 16, true)
            );
            console.log("\n");
            depthPosition += 20;
          }

          position += 100;

          console.log("last_traded_price: " + dvu.getFloat32(position, true));
          console.log("last_trade_time: " + dvu.getInt32(position + 4, true));
          console.log("security id: " + dvu.getInt32(position + 8, true));
          console.log("traded: " + dvu.getInt8(position + 12, true));
          console.log("Mode: " + dvu.getInt8(position + 13, true));
          console.log(
            "last_traded_quantity " + dvu.getInt32(position + 14, true)
          );
          console.log(
            "average_traded_price: " + dvu.getFloat32(position + 18, true)
          );
          console.log("volume: " + dvu.getInt32(position + 22, true));
          console.log(
            "total_buy_quantity: " + dvu.getInt32(position + 26, true)
          );
          console.log(
            "total_sell_quantity: " + dvu.getInt32(position + 30, true)
          );
          console.log("open: " + dvu.getFloat32(position + 34, true));
          console.log("close: " + dvu.getFloat32(position + 38, true));
          console.log("high: " + dvu.getFloat32(position + 42, true));
          console.log("low: " + dvu.getFloat32(position + 46, true));
          console.log("change_percent: " + dvu.getFloat32(position + 50, true));
          console.log(
            "change_absolute: " + dvu.getFloat32(position + 54, true)
          );
          console.log("52_week_high: " + dvu.getFloat32(position + 58, true));
          console.log("52_week_low: " + dvu.getFloat32(position + 62, true));
          console.log("oi: " + dvu.getInt32(position + 66, true));
          console.log("change_oi: " + dvu.getInt32(position + 70, true));
          position += 74;
        }

        function processIndexFullPacket(dvu) {
          console.log("last_trade_price: " + dvu.getFloat32(position, true));
          console.log("security id: " + dvu.getInt32(position + 4, true));
          console.log("traded: " + dvu.getInt8(position + 8, true));
          console.log("Mode: " + dvu.getInt8(position + 9, true));
          console.log("open " + dvu.getFloat32(position + 10, true));
          console.log("close: " + dvu.getFloat32(position + 14, true));
          console.log("high: " + dvu.getFloat32(position + 18, true));
          console.log("low: " + dvu.getFloat32(position + 22, true));
          console.log("change_percent: " + dvu.getFloat32(position + 26, true));
          console.log(
            "change_absolute: " + dvu.getFloat32(position + 30, true)
          );
          console.log("last_update_time: " + dvu.getInt32(position + 34, true));
          position += 38;
        }
      });
    }

    socket.addEventListener("close", function (event) {
      console.log("user disconnected");
    });

    return () => {
      socket.close();
    };
  }, [publicAccessToken]);

  return (
    <div className="dashboard-body bg-zinc-950">
      <div className="fund-position">
        <Optioncard
          indices="Nifty 50"
          optionIndices="NIFTY"
          ltp={LTP[0].Nifty50}
          changeAbsolute={LTP[0].changeAbsolute}
          changePercent={LTP[0].changePercent}
          sendIndices={receiveIndices}
          sendconfig={receiveconfig}
          sendltp={receiveltp}
        />
        <Optioncard
          indices="Nifty Bank"
          optionIndices="BANKNIFTY"
          ltp={LTP[1].Banknifty}
          changeAbsolute={LTP[1].changeAbsolute}
          changePercent={LTP[1].changePercent}
          sendIndices={receiveIndices}
          sendconfig={receiveconfig}
          sendltp={receiveltp}
        />
      </div>
      <div className="fund-position">
        <Optioncard
          indices="Nifty Financial Services"
          optionIndices="FINNIFTY"
          ltp={LTP[2].Finnifty}
          changeAbsolute={LTP[2].changeAbsolute}
          changePercent={LTP[2].changePercent}
          sendIndices={receiveIndices}
          sendconfig={receiveconfig}
          sendltp={receiveltp}
        />
        <Optioncard
          indices="Nifty Midcap Select"
          optionIndices="MIDCPNIFTY"
          ltp={LTP[3].Midcap}
          changeAbsolute={LTP[3].changeAbsolute}
          changePercent={LTP[3].changePercent}
          sendIndices={receiveIndices}
          sendconfig={receiveconfig}
          sendltp={receiveltp}
        />
      </div>

      <div className="market-chat dashboard-body-div">
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
