import React from "react";
import { CiSearch } from "react-icons/ci";
import StockData from "../Assets/data";

export default function Sidebar() {
  const Slider_list = StockData.map((data) => (
    <div className="slider-stock-list">
      <div className="stock-name-price">
        <div className="stock-name">{data.companyName}</div>
        <div className="stock-price-gain">{data.LastPrice}</div>
      </div>
      <div className="stock-sharemarket-pricedropp-persentdrop">
        <div className="stock-sharemarket">NSE</div>
        <div
          style={
            data.PercentGain > 0
              ? { color: "darkgreen", filter: "brightness(150%)" }
              : { color: "red" }
          }
        >
          {data.Change}
        </div>
        <div
          className="stock-price-gain"
          style={
            data.PercentGain > 0
              ? { color: "green", filter: "brightness(150%)" }
              : { color: "red" }
          }
        >
          ({data.PercentGain})
        </div>
      </div>
    </div>
  ));
  return (
    <div className="dashboard-slider">
      <div className="search-box">
        <div className="search-label">
          <CiSearch className="search-icon" />
        </div>
        <div className="search-stock-parent">
          <input
            type="text"
            name="search-stock"
            className="search-stock"
            id="search-stock"
            placeholder="Search by Stock Name"
          />
        </div>
      </div>
      <div className="slider-stock-lists">{Slider_list}</div>
      {/* <h1>Component B</h1> */}
    </div>
  );
}
