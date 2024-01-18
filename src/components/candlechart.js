import React, { useEffect, useState } from "react";
import { createChart } from "lightweight-charts";
// import { priceData } from "./priceData";

import "./style.css";

function CandlestickChart(props) {
  //Variables
  const [LTP, setLTP] = useState(null);
  const publicAccessToken = JSON.parse(
    localStorage.getItem("users")
  ).public_access_token;
  const [resize, setResize] = useState(window.innerWidth);
  const [series, setSeries] = useState();
  const [bar, setBar] = useState(null);

  //historical data using api
  // dependancy -> priceData and resize this useEffect will run when the screen will resize and priceData will change
  useEffect(() => {
    //option of the chart means css of chart
    const chartOptions = {
      layout: {
        textColor: "rgba(255, 255, 255, 0.9)",
        background: { type: "solid", color: "#253248" },
      },
      grid: {
        vertLines: {
          color: "#334158",
        },
        horzLines: {
          color: "#334158",
        },
      },
      crosshair: {},
      priceScale: {
        borderColor: "#485c7b",
      },
      timeScale: {
        borderColor: "#485c7b",
        timeVisible: true,
        secondsVisible: false,
      },
    };

    const chartElement = document.getElementById("tradingview");
    if (chartElement) {
      // Remove any existing chart before creating a new one
      chartElement.innerHTML = "";
      //creating a chart
      const chart = createChart(chartElement, chartOptions);
      //series of the chart data entry of the chart
      const candlestickSeries = chart.addCandlestickSeries({
        upColor: "#26a69a",
        downColor: "#ef5350",
        borderDownColor: "#ff4976",
        borderUpColor: "#4bffb5",
        wickUpColor: "#26a69a",
        wickDownColor: "#ef5350",
      });
      setSeries(candlestickSeries);
      console.log(props.priceData);
      console.log("props");
      candlestickSeries.setData(props.priceData);
      chart.timeScale().fitContent();
    }
  }, [props.priceData, resize]);

  //websocket connection
  //getting binary data,binary to decimam conversion and updating the LTP Usestate
  //no need of dependancy because it is a websocket it will run contineous
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
        // console.log(l);

        var dvu = new DataView(data);
        let position = 0;
        while (position != l) {
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
          setLTP(dvu.getFloat32(position, true));
          const last_trade_price = dvu.getFloat32(position, true);

          // console.log(`LTP-${LTP}`);

          // setBar(() => {
          //   var time = new Date();
          //   const hours = time.getHours();
          //   const minutes = time.getMinutes();
          //   const validtime = hours * 60 + minutes;
          //   if (validtime >= 570) {
          //     time = Date.parse(time);
          //     time = Math.floor((time + 19800000) / 300000) * 300;
          //     if (nextTime === null || nextTime == time) {
          //       // nextTime = time + 300;
          //       setNextTime(time + 300);
          //       console.log(nextTime);
          //     }
          //     console.log(LTP);

          //     return {
          //       time: time,
          //       open: last_trade_price - 10,
          //       high: last_trade_price + 50,
          //       low: last_trade_price - 20,
          //       close: last_trade_price,
          //     };
          //   } else {
          //     // return props.priceData[1];
          //   }
          // });

          // console.log(bar);
          // console.log("here");
          console.log("last_trade_price: " + dvu.getFloat32(position, true));
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
          const depthPosition = position;
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
  }, []);
  // this useEffect will run only when LTP will change in previous useEffect
  //the contineous changing LTP will run it contineously and it will update the Usestate bar
  useEffect(() => {
    if (LTP != null) {
      setBar(() => {
        var time = new Date();
        const hours = time.getHours();
        const minutes = time.getMinutes();
        const validtime = hours * 60 + minutes;
        time = Date.parse(time);
        time = Math.floor((time + 19800000) / 300000) * 300;
        if (validtime >= 555 && validtime < 930) {
          if (bar === null) {
            let n = props.priceData.length;
            console.log(n);
            console.log("here");
            return {
              time: props.priceData[n - 1].time,
              open: props.priceData[n - 1].open,
              high: props.priceData[n - 1].high,
              low: props.priceData[n - 1].low,
              close: props.priceData[n - 1].close,
            };
          } else {
            if (time === bar.time + 300) {
              return {
                time: time,
                open: LTP,
                high: LTP,
                low: LTP,
                close: LTP,
              };
            } else {
              var open = bar.open;
              var high = bar.high;
              var low = bar.low;
              console.log(bar.close);
              // var close=bar.close;
              high = LTP > high ? high : LTP;
              low = LTP < low ? low : LTP;
              return {
                time: time,
                open: open,
                high: high,
                low: low,
                close: LTP,
              };
            }
          }
        } else {
          let n = props.priceData.length;

          return {
            time: props.priceData[n - 1].time,
            open: props.priceData[n - 1].open,
            high: props.priceData[n - 1].high,
            low: props.priceData[n - 1].low,
            close: props.priceData[n - 1].close,
          };
        }
      });
    }
  }, [LTP]);
  //updating the chart whenever bar(candle) changes in previous useEffect
  useEffect(() => {
    if (bar !== null && series !== null) {
      series.update(bar);
    }
  }, [series, bar]);

  //rerender while resize
  useEffect(() => {
    const intervalId = setInterval(() => {
      setResize(window.innerWidth);
    }, 1500);

    return () => {
      // Clear the interval when the component is unmounted
      clearInterval(intervalId);
    };
  }, []);

  return (
    <div className="tradingview" id="chart">
      <div id="tradingview" className="chart-container"></div>
    </div>
  );
}

export default CandlestickChart;
