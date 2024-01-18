import { useState } from "react";
import Logo from "../Assets/logo.png";
import { Link } from "react-router-dom";
import { useEffect } from "react";
// import { Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Navigation = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("Profile");
  const users = JSON.parse(localStorage.getItem("users"));
  useEffect(() => {
    if (users) {
      // console.log(users.read_access_token);
      fetch("http://localhost:5000/getname", {
        method: "GET",
        headers: {
          "x-jwt-token": users.read_access_token,
        },
      })
        .then((Response) => {
          return Response.json();
        })
        .then((Response) => {
          const nameParts = Response.data.kycName.split(" ");
          setName(`Hi ${nameParts[0]} ${nameParts[2]}`);
          // console.log(Response);
        })
        .catch((error) => {
          // Handle errors that occurred during the fetch
          localStorage.removeItem("users");
          navigate("/");
          console.error("Error during fetch:", error);
        });
    }
  }, [users]);

  return (
    <nav className="navigation">
      <img src={Logo} alt="logo" className="logo" />
      <ul className="nav-list">
        <li>
          <Link to="/Dashboard" title="Dashboard">
            Dashboard
          </Link>
        </li>
        <li>
          <Link to="/Stocks" title="Stocks">
            Stocks
          </Link>
        </li>
        <li>
          <Link to="/mutual-funds" title="Mutual-funds">
            Mutual Funds
          </Link>
        </li>
        <li>
          <Link to="/Fno" title="Fno">
            Fno
          </Link>
        </li>
        <li>
          <Link to="/IPO" title="IPO">
            IPO
          </Link>
        </li>
        <li>
          <Link to="/more">More</Link>
        </li>
      </ul>
      <div className="profile">{name}</div>
    </nav>
  );
};

export default Navigation;
