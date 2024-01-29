import "./App.css";
import Navigation from "./components/nav";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "./components/dashboard";
import ZoomedChart from "./components/zoomedChart";
import Signin from "./components/Signin";
import Login from "./components/login";
import Fno from "./components/Fno";
import PrivateComponent from "./components/PrivateComponent";
import Stocks from "./components/Stocks";
// import { useState } from "react";
function App() {
  // const [name,setName]=useState();

  return (
    <div className="App">
      <BrowserRouter>
        <Navigation />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route element={<PrivateComponent />}>
            <Route path="/Stocks" element={<Stocks />} />
            <Route path="/Fno" element={<Fno />} />
            <Route path="/Signin" element={<Signin />} />
            <Route path="/Dashboard" element={<Dashboard />} />
            <Route path="/ZoomedChart" element={<ZoomedChart />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
