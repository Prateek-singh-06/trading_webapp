import Split from "react-split";
import Sidebar from "./Sidebar";
import Editor from "./Editor";
import { useState } from "react";
export default function Dashboard() {
  const [LTP, setLTP] = useState(null);
  const receiveltp = (input) => {
    setLTP(input);
  };
  return (
    <div className="dashboard">
      <Split sizes={[30, 70]} direction="horizontal" className="split">
        <Sidebar />
        <Editor sendltp={receiveltp} />
      </Split>
    </div>
  );
}
