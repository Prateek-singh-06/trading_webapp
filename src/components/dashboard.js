import Split from "react-split";
import Sidebar from "./Sidebar";
import Editor from "./Editor";
export default function dashboard() {
  return (
    <div className="dashboard">
      <Split sizes={[30, 70]} direction="horizontal" className="split">
        <Sidebar />
        <Editor />
      </Split>
    </div>
  );
}
