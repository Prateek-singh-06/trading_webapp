import "../Fno.css";
// import OptionData from "../Assets/option_data";
import { useEffect, useState, useRef } from "react";
const Optionchain = (props) => {
  const [Optiondata_put, setOptiondata_put] = useState(null);
  const [Optiondata_call, setOptiondata_call] = useState(null);
  const [optionchaindatashown, setoptionchaindatashown] = useState(null);
  const myRef = useRef(null);
  const users = JSON.parse(localStorage.getItem("users"));
  const [scroll, setscroll] = useState(0);
  const [optionData, setoptionData] = useState({
    expDate: "",
    optiontype: "LTP",
  });

  function roundUpToNearest(number, indices) {
    const result =
      indices === "NIFTY"
        ? Math.ceil(number / 50) * 50
        : indices === "BANKNIFTY"
        ? Math.ceil(number / 100) * 100
        : indices === "FINNIFTY"
        ? Math.ceil(number / 50) * 50
        : Math.ceil(number / 25) * 25;
    return result;
  }
  //put
  useEffect(() => {
    if (props.config) {
      const date = new Date(props.config.data.expires[0]);
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
      const year = date.getFullYear();
      const formattedDate = `${day}-${month}-${year}`;
      const fetchdata = async () => {
        try {
          // console.time("checkedtime1");
          const response = await fetch(
            "http://localhost:5000/fno/optionchain",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "x-jwt-token": users.read_access_token,
              },
              body: JSON.stringify({
                type: "PUT",
                symbol: `${props.Indices}`,
                expiry: `${formattedDate}`,
              }),
            }
          );
          const result = await response.json();
          setOptiondata_put(result);
        } catch (err) {
          console.log(err);
        }
      };
      if (props.Indices) {
        fetchdata();
      }
    }
  }, [props.Indices, props.config]);

  //call
  useEffect(() => {
    if (props.config) {
      const date = new Date(props.config.data.expires[0]);
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
      const year = date.getFullYear();
      const formattedDate = `${day}-${month}-${year}`;
      const fetchdata = async () => {
        try {
          const response = await fetch(
            "http://localhost:5000/fno/optionchain",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "x-jwt-token": users.read_access_token,
              },
              body: JSON.stringify({
                type: "CALL",
                symbol: `${props.Indices}`,
                expiry: `${formattedDate}`,
              }),
            }
          );
          const result = await response.json();
          setOptiondata_call(result);
        } catch (err) {
          console.log(err);
        }
      };
      if (props.Indices) {
        fetchdata();
      }
    }
  }, [props.Indices, props.config]);

  //showing the data
  useEffect(() => {
    console.log("component rendered 0");

    if (Optiondata_put !== null && Optiondata_call !== null) {
      const calloption = Optiondata_call.data.results;
      const putoption = Optiondata_put.data.results;
      let myMap = new Map();
      calloption.map((item) => {
        const present = myMap.get(item.stk_price);
        myMap.set(item.stk_price, {
          ...present,
          price_call: item.price,
          delta_call: item.delta,
          oi_call: item.oi,
          iv: item.iv,
        });
      });

      putoption.map((item) => {
        const present = myMap.get(item.stk_price);
        myMap.set(item.stk_price, {
          ...present,
          price_put: item.price,
          delta_put: item.delta,
          oi_put: item.oi,
        });
      });

      // console.log(myMap.get(21550));

      const optionchaindatashown = Array.from(myMap.entries())
        .sort((a, b) => a[0] - b[0]) // Sort based on keys
        .map(([key, item]) => (
          <div id={key} className="w-full h-11 flex border-b-2">
            <div className="w-1/12 h-full font-sans font-normal border-r-2 text-xs center">
              {item.delta_call ? item.delta_call : "---"}
            </div>
            <div className="w-5/12 h-full border-r-2 flex">
              <div className="mr-auto font-normal text-sm ml-1 center">
                {item.price_call ? item.price_call : "---"}
              </div>
              <div className="text-red-500 font-medium text-sm mr-1 center">
                {item.oi_call}
              </div>
            </div>
            <div className="w-2/12 h-full font-sans font-normal text-sm center border-r-2">
              {key}
            </div>
            <div className="w-1/12 h-full font-sans font-normal text-sm center border-r-2">
              {item.iv ? item.iv : "---"}
            </div>
            <div className="w-5/12 h-full border-r-2 flex">
              <div className="mr-auto font-medium text-sm ml-1 center text-green-600">
                {item.oi_put ? item.oi_put : "---"}
              </div>
              <div className="font-normal text-sm mr-1 center">
                {item.price_put ? item.price_put : "---"}
              </div>
            </div>
            <div className="w-1/12 h-full font-sans font-normal text-xs center">
              {item.delta_put ? item.delta_put : "---"}
            </div>
          </div>
        ));
      console.log("component rendered 1");

      setoptionchaindatashown(optionchaindatashown);
    }
    console.log("component rendered");
  }, [Optiondata_put, Optiondata_call]);

  //scroll
  useEffect(() => {
    console.log(props.LTP);
    if (props.LTP !== null && optionchaindatashown !== null) {
      console.log("optiondata_call");
      console.log(Optiondata_call);
      const LTPt = roundUpToNearest(props.LTP, props.Indices);
      console.log(LTPt);
      const elementWithId = document.getElementById(`${LTPt}`);
      console.log("in optionchain");
      console.log(elementWithId);
      if (elementWithId) {
        myRef.current = elementWithId;
        myRef.current.scrollIntoView({ block: "center", behavior: "smooth" });
      }
    }
  }, [!props.LTP, optionchaindatashown]);

  const handlechange = (e) => {
    console.log(e.target.value);
    setoptionData((pre) => {
      return {
        ...pre,
        optiontype: e.target.value,
      };
    });
  };

  return (
    <div className="Optionchain border-r-2">
      <div className="flex flex-row h-20 w-full items-center border-b-2">
        <div className="w-5/48 h-8 center option rounded-lg ml-2 mr-4 bg-blue-600 text-white cursor-pointer ">
          OPT
        </div>
        <select className="w-6/24 h-8 center option rounded mr-4 cursor-pointer text-xs font-medium outline-none">
          {props.config &&
            props.config.data.expires.map((key, index) => {
              // const timestamp = 1643779200000;

              const date = new Date(key);
              const year = date.toLocaleDateString("en-US", {
                year: "numeric",
              });
              const month = date.toLocaleDateString("en-US", {
                month: "short",
              });
              const day = date.toLocaleDateString("en-US", { day: "2-digit" });
              const formattedDate = `${day} ${month} ${year}`;
              return (
                <option value={formattedDate} className="text-xs">
                  {formattedDate}
                </option>
              );
            })}
        </select>
        <select
          multiple
          className="option w-4/12 h-8 rounded mr-auto overflow-y-hidden whitespace-nowrap outline-none cursor-pointer "
          selected
          // onChange={handlechange}
        >
          <option
            className="w-4/12 rounded ml-1 mr-1 mt-1 text-base font-sans inline-block text-center checked:bg-blue-600 checked:text-white cursor-pointer"
            value="LTP"
            selected
            onClick={handlechange}
          >
            LTP
          </option>
          <option
            className="w-3/12 rounded mr-1 text-base font-sans inline-block text-center checked:bg-blue-600 checked:text-white cursor-pointer"
            value="OI"
            onClick={handlechange}
          >
            OI
          </option>
          <option
            className="w-4/12 rounded mr-1  text-base inline-block text-center checked:bg-blue-600 checked:text-white cursor-pointer"
            value="Greeks"
            onClick={handlechange}
          >
            Greeks
          </option>
        </select>
        <div className="option w-6/24 h-8 flex items-center justify-center rounded-lg mr-2 font-sans font-medium text-sm cursor-pointer">
          {props.Indices && props.Indices}
        </div>
      </div>
      <div className="mr-2 border-b-2 h-7 center">
        <div className="w-1/12 h-full font-sans font-normal border-r-2 text-xs center">
          Delta
        </div>
        <div className="w-5/12 h-full border-r-2 flex">
          <div className="mr-auto font-normal text-sm ml-1 center">
            Call LTP
          </div>
          <div className="text-red-500 font-medium text-sm mr-1 center">
            Call OI
          </div>
        </div>
        <div className="w-2/12 h-full font-sans font-normal text-sm center border-r-2">
          Strike
        </div>
        <div className="w-1/12 h-full font-sans font-normal text-sm center border-r-2">
          IV
        </div>
        <div className="w-5/12 h-full border-r-2 flex">
          <div className="mr-auto font-medium text-sm ml-1 center text-green-600">
            Put OI
          </div>
          <div className="font-normal text-sm mr-1 center">Put LTP</div>
        </div>
        <div
          key="useid"
          className="w-1/12 h-full font-sans font-normal text-xs center"
        >
          Delta
        </div>
      </div>
      <div className=" w-full h-5/6 overflow-y-scroll scroll-container ">
        {optionchaindatashown}
      </div>
    </div>
  );
};
export default Optionchain;
