import { Link } from "react-router-dom";
import logo from "../assets/logo.jpeg";

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm fixed-top">
      <div className="container-fluid px-4">

        <div className="navbar-brand d-flex align-items-center">
          <img src={logo} alt="logo" className="navbar-logo" />

          <div className="academy-text">
            <span className="academy-title">KMSASK</span>
            <span className="academy-subtitle">Silamba Koodam</span>
          </div>
        </div>

        <button className="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#nav">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="nav">
          <ul className="navbar-nav ms-auto align-items-center">

            <li className="nav-item">
              <a href="#home" className="nav-link text-dark">Home</a>
            </li>

            <li className="nav-item">
              <a href="#level" className="nav-link text-dark">Levels</a>
            </li>

            <li className="nav-item">
              <a href="#instructor" className="nav-link text-dark">Instructors</a>
            </li>

            <li className="nav-item">
              <a href="#about" className="nav-link text-dark">About</a>
            </li>

            <li className="nav-item">
              <a href="#contact" className="nav-link text-dark">Contact</a>
            </li>

            <li className="nav-item ms-3">
              <Link to="/login" className="btn btn-outline-primary me-2">
                Login
              </Link>
            </li>

            <li className="nav-item">
              <Link to="/register" className="btn btn-primary">
                Register
              </Link>
            </li>

          </ul>
        </div>

      </div>
    </nav>
  );
}

export default Navbar;