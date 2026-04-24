import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiMenu, FiLogOut } from "react-icons/fi"; 
import logo from "../assets/logo.jpeg";
import "./DashboardNavbar.css";

function DashboardNavbar() {

  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      {/* NAVBAR */}
      <div className="dash-navbar">

        {/* LEFT MENU ICON */}
        <div className="menu-icon left" onClick={() => setOpen(true)}>
          ☰
        </div>

        {/* CENTER LOGO */}
        <div className="dash-logo">
          <img src={logo} alt="logo" />
          <div>
            <h5>KALAIMUDHUMANI SUBRAMANIYA AASSAN SILAMBA KOODAM</h5>
            <span>Raising Warriors</span>
          </div>
        </div>
        {/* RIGHT LOGOUT ICON */}
        <div
          className="logout-icon"
          onClick={() => {
            localStorage.clear();
            window.location.href = "/";
          }}
        >
          <FiLogOut size={22} /><br></br>
          <p>Logout</p>
        </div>
      </div>

      {/* SIDE DRAWER */}
      <div className={`side-drawer ${open ? "open" : ""}`}>

        <div className="close-btn" onClick={() => setOpen(false)}>✕</div>

        <button onClick={() => navigate("/login")}>Login</button>
        <button onClick={() => navigate("/register")}>Register</button>

        <button
          className="logout"
          onClick={() => {
            localStorage.clear();
            window.location.href = "/";
          }}
        >
          Logout
        </button>

      </div>

      {/* OVERLAY */}
      {open && <div className="overlay" onClick={() => setOpen(false)} />}
    </>
  );
}

export default DashboardNavbar;