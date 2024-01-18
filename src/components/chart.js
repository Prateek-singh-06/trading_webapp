import { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { createChart, CrosshairMode } from "lightweight-charts";

const StockChart = ({ candlestickData, interval }) => {
  var [height, setheight] = useState(340);

  useEffect(() => {
    const chart = document.getElementById("chart");
    const chartWidth = chart.getBoundingClientRect();
    const width = chartWidth.width;
    if (width > 1100) {
      setheight(635);
    }
  }, []);

  const options = {
    chart: {
      type: "candlestick",
      height: 350,
      zoom: {
        enabled: true,
        // type: "x",
        type: "y",
        autoScaleYaxis: false,
        zoomedArea: {
          fill: {
            color: "#90CAF9",
            opacity: 0.2,
          },
          stroke: {
            color: "#0D47A1",
            opacity: 0.2,
            width: 1,
          },
        },
      },
    },
    title: {
      text: "CandleStick Chart",
      align: "left",
    },
    xaxis: {
      // type: "datetime",
      // categories: category,
      labels: {
        show: true,
        rotate: 0,
        rotateAlways: false,
        formatter: function (val) {
          // Use a custom formatter to display only the time part
          var date = new Date(val);
          date = date - 19800000;
          date = new Date(date);
          var day = date.getDay();
          day =
            day === 0
              ? "Sun"
              : day === 1
              ? "Mon"
              : day === 2
              ? "Tue"
              : day === 3
              ? "Wed"
              : day === 4
              ? "Thu"
              : day === 5
              ? "Fri"
              : "Sat";

          const monthName = date.toLocaleString("default", { month: "short" });
          const dateName = date.getDate();
          const yearName = date.getFullYear().toString().slice(2);

          const yearinclude =
            day +
            " " +
            dateName +
            " " +
            monthName +
            " " +
            yearName +
            " " +
            date.getHours() +
            ":" +
            date.getMinutes();
          const yearexclude =
            day +
            " " +
            dateName +
            " " +
            monthName +
            " " +
            date.getHours() +
            ":" +
            date.getMinutes();
          const dateshow =
            interval === "ONE_DAY" || interval === "ONE_HOUR"
              ? yearinclude
              : yearexclude;

          return dateshow;
          // return date;
        },
        style: {
          colors: [],
          fontSize: "11px",
          fontFamily: "Helvetica, Arial, sans-serif",
          fontWeight: 500,
          cssClass: "apexcharts-xaxis-label",
        },
      },
      tickAmount: 5,
    },
    yaxis: {
      tooltip: {
        enabled: true,
      },
    },
  };

  return (
    <div id="chart">
      {/* Candlestick Chart */}
      <Chart
        options={options}
        series={[{ data: candlestickData }]}
        type="candlestick"
        height={height}
        width={"100%"}
      />
    </div>
  );
};

export default StockChart;
