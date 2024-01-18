import React, { useEffect, useState } from "react";
// import { io } from "socket.io-client";
import websocket from "ws";

const StockMarketStream = () => {
  const [socket, setSocket] = useState(null);
  const [stockData, setStockData] = useState(null);
  const [LTP, setLTP] = useState(0);
  const publicAccessToken = JSON.parse(
    localStorage.getItem("users")
  ).public_access_token;
  const preferences = [
    {
      actionType: "ADD",
      modeType: "FULL",
      scripType: "INDEX",
      exchangeType: "NSE",
      scripId: "13",
    },
    {
      actionType: "ADD",
      modeType: "LTP",
      scripType: "EQUITY",
      exchangeType: "BSE",
      scripId: "523144",
    },
  ];

  useEffect(() => {
    console.log(publicAccessToken);
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
        console.log(l);

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

          console.log(LTP);
          console.log("last_trade_price: " + dvu.getFloat32(position, true));
          console.log("last_update_time: " + dvu.getInt32(position + 4, true));
          console.log("security id: " + dvu.getInt32(position + 8, true));
          console.log("traded: " + dvu.getInt8(position + 12, true));
          console.log("Mode: " + dvu.getInt8(position + 13, true));
          console.log("changeAbsolute: " + dvu.getFloat32(position + 14, true));
          console.log("changePercent: " + dvu.getFloat32(position + 18, true));
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

    // // Event triggered when user connection gets an error
    // socket.on("error", function (event) {
    //   console.log("error");
    // }); // Event triggered when user connection gets a message from the server
    // socket.on("message", function (message) {
    //   try {
    //     console.log("Message: " + message.data);
    //   } catch (e) {
    //     console.log("Error: " + e);
    //   }
    // });

    // setSocket(socket);

    return () => {
      socket.close();
    };
  }, []);

  return (
    <div>
      <h1>Stock Market Live Stream</h1>
      {LTP && (
        <div>
          <h2>Stock Data :</h2>
          <div>{parseFloat(LTP.toFixed(2))}</div>
          {/* <pre>{LTP}</pre> */}
          {/* <pre>{JSON.stringify(LTP, null, 2)}</pre> */}
        </div>
      )}
    </div>
  );
};

export default StockMarketStream;
