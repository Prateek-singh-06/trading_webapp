import { useState } from "react";
import { useNavigate } from "react-router-dom";
const Input = (props) => {
  const [formData, setFormData] = useState({
    interval: "FIVE_MINUTE",
    fromdate: "",
    todate: "",
  });
  const navigate = useNavigate();

  var currentdate = new Date();
  currentdate = currentdate.toISOString().replace("T", " ").slice(0, 16);

  const handlesubmit = (e) => {
    e.preventDefault();
    console.log(formData.interval);
    props.sendChartInputData(formData);
  };

  const handleChange = (e) => {
    var { name, value } = e.target;
    if (name !== "interval") {
      value = value.replace("T", " ");
    }
    setFormData((previous) => {
      return { ...previous, [name]: value };
    });
  };
  function handlenavigation() {
    navigate("/ZoomedChart");
  }

  return (
    <div>
      <form onSubmit={handlesubmit} className="chartInput">
        <select
          // id={""}
          className="chartInputInterval"
          value={formData.interval}
          // title="Interval"
          // style={}
          onChange={handleChange}
          name="interval"
        >
          <option value="ONE_MINUTE">1M</option>
          <option value="THREE_MINUTE">3M</option>
          <option value="FIVE_MINUTE">5M</option>
          <option value="TEN_MINUTE">10M</option>
          <option value="FIFTEEN_MINUTE">15M</option>
          <option value="THIRTY_MINUTE">30M</option>
          <option value="ONE_HOUR">1H</option>
          <option value="ONE_DAY">1D</option>
        </select>

        <input
          type="datetime-local"
          onChange={handleChange}
          // min="2023-01-01"
          value={formData.fromdate}
          max={currentdate}
          className="fromdate"
          title="From"
          name="fromdate"
        />

        <input
          type="datetime-local"
          name="todate"
          onChange={handleChange}
          value={formData.todate}
          // min="2023-01-01"
          title="To"
          max={currentdate}
          className="todate"
        />
        <button type="submit" className="chartDataSubmit">
          Get chart
        </button>
      </form>
      <button
        className="maximize"
        onClick={handlenavigation}
        title="maximize"
      ></button>
    </div>
  );
};
export default Input;
