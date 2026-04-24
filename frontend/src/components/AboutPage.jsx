import React from "react";
import "./AboutPage.css";
import Footer from "./Footer";
import { Link } from "react-router-dom";
import aasan1 from "../assets/aasan1.jpeg";
function AboutPage() {
  return (
    <>
    <div className="about-page container-fluid">
       {/* NAVBAR */}
      <nav className="navbar navbar-expand-lg navbar-light shadow-sm fixed-top">
        <div className="container-fluid px-4">
          <a className="navbar-brand fw-bold text-white">
            KMSASK Silamba Koodam
          </a> 

          <button className="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#nav">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="nav">
            <ul className="navbar-nav ms-auto align-items-center">

              <li className="nav-item">
                  <Link  className="nav-link text-white" to="/#home">Home</Link>
              </li>

              <li className="nav-item">
                  <Link  className="nav-link text-white" to="/#courses">Level</Link>
              </li>

              <li className="nav-item">
                  <Link  className="nav-link text-white" to="/#instructors">Instructors</Link>
              </li>

              <li className="nav-item">
                  <Link  className="nav-link text-white" to="/#about">About</Link>
              </li>

              <li className="nav-item">
                  <Link  className="nav-link text-white" to="/#contact">Contact</Link>
              </li>

              <Link to="/login">
              <li className="nav-item ms-3">
                <button className="btn  btn-light me-2">Login</button>
              </li>
              </Link>
              
              <Link to="/register">
              <li className="nav-item">
                <button className="btn btn-primary">Register</button>
              </li>
              </Link>

            </ul>
            
          </div>
        </div>
      </nav>

      {/* HISTORY SECTION */}

      <div className="row align-items-center mt-5">

        <div className="col-md-6">

          <h2 className="text-primary fw-bold mb-5">
            History & Legacy of
            <br />
            KALAIMUDHUMANI SUBRAMANIYA
            <br />
            AASAN SILAMBA KOODAM
          </h2>

          <p>
            Established in 2006 by Kalaimudhumani Subramaniya Aasan,
            our academy promotes the ancient Tamil martial art
            Silambam. Our mission is to preserve traditional
            weapons training, physical conditioning, and cultural
            pride.
          </p>

          <p>
            Through years of dedication we have trained hundreds
            of students and produced many competition champions.
          </p>

        </div>

        <div className="col-md-6">

          <img
            src={aasan1}
            className="img-fluid rounded"
            alt="silambam"
            style={{width:"700px", height: "600px", marginLeft:"10px"}}
          />

        </div>

      </div>


      {/* STATS CARDS */}

      <div className="row stats-row">

        <div className="col-md-4">
          <div className="stat-card">
            <h3>15+</h3>
            <p>Years of Excellence</p>
          </div>
        </div>

        <div className="col-md-4">
          <div className="stat-card">
            <h3>1000+</h3>
            <p>Students Trained</p>
          </div>
        </div>

        <div className="col-md-4">
          <div className="stat-card">
            <h3>200+</h3>
            <p>Awards Won</p>
          </div>
        </div>

      </div>


      {/* FOUNDER */}

      <div className="row align-items-center mt-5">

        <div className="col-md-6">
          <h3 className="text-center text-primary fw-bold mb-5">Our Founder : Kalaimudhumani Subramaniya Aasan</h3>

          <ul className="founder-list">

            <li>Recognized Silambam master</li>
            <li>Certified martial arts trainer</li>
            <li>Represented Tamil Nadu in competitions</li>
            <li>Winner of multiple awards</li>
            <li>Vision to spread Silambam worldwide</li>

          </ul>

        </div>

        <div className="col-md-6">

          <img
            src="https://images.unsplash.com/photo-1546519638-68e109498ffc"
            className="img-fluid rounded"
            alt="founder"
          />

        </div>

      </div>


      {/* TIMELINE */}

      <h3 className="text-center text-primary fw-bold mb-5">
        Timeline of Our Academy
      </h3>

      <div className="row timeline-row">

        <div className="col-md-3">
          <div className="timeline-card">
            <h4>2006</h4>
            <p>Academy Established</p>
          </div>
        </div>

        <div className="col-md-3">
          <div className="timeline-card">
            <h4>2010</h4>
            <p>State Level Recognition</p>
          </div>
        </div>

        <div className="col-md-3">
          <div className="timeline-card">
            <h4>2015</h4>
            <p>First National Competition</p>
          </div>
        </div>

        <div className="col-md-3">
          <div className="timeline-card">
            <h4>2022</h4>
            <p>Online Silambam Platform</p>
          </div>
        </div>

      </div>


      {/* STUDENT ACHIEVEMENTS */}

      <h3 className="text-center text-primary fw-bold mb-5">
        Student Achievements & Awards
      </h3>

      <div className="row gallery-row">

        <div className="col-md-4">
          <img
            src="https://images.unsplash.com/photo-1517649763962-0c623066013b"
            className="gallery-img"
            alt=""
          />
        </div>

        <div className="col-md-4">
          <img
            src="https://images.unsplash.com/photo-1508098682722-e99c43a406b2"
            className="gallery-img"
            alt=""
          />
        </div>

        <div className="col-md-4">
          <img
            src="https://images.unsplash.com/photo-1547347298-4074fc3086f0"
            className="gallery-img"
            alt=""
          />
        </div>

        <div className="col-md-4">
          <img
            src="https://images.unsplash.com/photo-1599059813005-11265ba4b4ce"
            className="gallery-img"
            alt=""
          />
        </div>

        <div className="col-md-4">
          <img
            src="https://images.unsplash.com/photo-1521417531039-9bca14e06c03"
            className="gallery-img"
            alt=""
          />
        </div>

        <div className="col-md-4">
          <img
            src="https://images.unsplash.com/photo-1602192103306-47e6672e8b3a"
            className="gallery-img"
            alt=""
          />
        </div>

      </div>

    </div>
<Footer />
    </>
  );
  
}

export default AboutPage;