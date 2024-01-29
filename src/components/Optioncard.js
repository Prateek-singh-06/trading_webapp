const Fund = (props) => {
  const users = JSON.parse(localStorage.getItem("users"));
  const textstyle = {
    color: props.changeAbsolute >= 0 ? "green" : "red",
    fontWeight: "bold",
  };
  const handleOptionchain = (e) => {
    e.preventDefault();
    console.log(e.target.id);
    const fetchdata = async () => {
      try {
        const response = await fetch("http://localhost:5000/fno/config", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-jwt-token": users.read_access_token,
          },
          body: JSON.stringify({
            symbol: `${e.target.id}`,
          }),
        });
        const result = await response.json();
        props.sendconfig(result);
        props.sendIndices(e.target.id);
        props.sendltp(props.ltp);
        // console.log(result);
      } catch (err) {
        console.log(err);
      }
    };
    fetchdata();
  };
  return (
    <div className="dashboard-body-divs fund border-1 bg-#212121">
      <div className="fund-data relative ">
        <div className="text-left ml-3 h-1/4 text-gray-700 text-lg font-semibold mt-3">
          <div className="fund-data-heading-html font-sans text-white">
            {props.indices}
          </div>
        </div>
        <div className="flex w-full">
          <div className="fund-data-value fund-common text-white ">
            {Math.ceil(props.ltp * 100) / 100}
          </div>
          <div style={textstyle} className="fund-data-value fund-common">
            {Math.ceil(props.changeAbsolute * 100) / 100}(
            {Math.ceil(props.changePercent * 100) / 100}%)
          </div>
        </div>
        <div className="absolute  bottom-0 w-full mb-0 h-2/6 flex ">
          <div
            className="w-1/2 center rounded-bl-md text-light-custom-blue font-medium font brightness-200 bg-#181818 border-r-2 border-r-gray-950 cursor-pointer"
            id={props.optionIndices}
            onClick={handleOptionchain}
          >
            Option Chain
          </div>
          <div className="w-1/2 center rounded-br-md text-light-custom-blue brightness-200 font-medium bg-#181818 cursor-pointer">
            Chart
          </div>
        </div>
      </div>
    </div>
  );
};

export default Fund;
