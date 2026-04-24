import React from "react";
import { Link } from "react-router-dom";
import { useState,useEffect,useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "./HomePage.css";
import Footer from "./Footer"
import logo from "../assets/logo.jpeg";

function HomePage() {

  const [instructors, setInstructors] = useState([]);
  const scrollRef = useRef();
  const [loopData, setLoopData] = useState([]);
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

useEffect(() => {
  api.get("public-instructors/")
    .then(res => {
      setInstructors(res.data);
      setLoopData([...res.data, ...res.data]); // duplicate
    })
    .catch(err => console.log(err));
}, []);

useEffect(() => {
  const container = scrollRef.current;
  const cardWidth = 320; // card + gap
  let index = 0;

  const interval = setInterval(() => {
    if (!container) return;

    index++;

    container.scrollTo({
      left: index * cardWidth,
      behavior: "smooth"
    });

    // 🔥 WHEN REACH HALF → RESET SILENTLY
    if (index >= loopData.length / 2) {
      setTimeout(() => {
        container.style.scrollBehavior = "auto"; // remove smooth
        container.scrollLeft = 0; // reset silently
        container.style.scrollBehavior = "smooth";
        index = 0;
      }, 600); // wait for animation
    }

  }, 2500); // pause time

  return () => clearInterval(interval);
}, [loopData]);

useEffect(() => {
  api.get("all-courses/")
    .then(res => {
      setCourses(res.data);
    })
    .catch(err => console.log(err));
}, []);

  return (
    <>
    <div>
      
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm fixed-top">
  <div className="container-fluid px-4">
    <a className="navbar-brand d-flex align-items-center">
  <img src={logo} alt="logo" className="navbar-logo" />

  <div className="academy-text">
    <span className="academy-title">KMSASK</span>
    <span className="academy-subtitle">Silamba Koodam</span>
  </div>
</a>

    <button className="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#nav">
      <span className="navbar-toggler-icon"></span>
    </button>

    <div className="collapse navbar-collapse" id="nav">
      <ul className="navbar-nav ms-auto align-items-center">

        <li className="nav-item">
          <a href= "#home" className="nav-link text-dark">Home</a>
        </li>

        <li className="nav-item">
          <a href = "#courses" className="nav-link text-dark">Courses</a>
        </li>

        <li className="nav-item">
          <a href = "#instructors" className="nav-link text-dark">Instructors</a>
        </li>

        <li className="nav-item">
          <a href= "#about" className="nav-link text-dark">About</a>
        </li>

        <li className="nav-item">
          <a href= "#contact" className="nav-link text-dark">Contact</a>
        </li>


        <Link to="/login">
        <li className="nav-item ms-3">
          <button className="btn btn-outline-primary me-2">
            Login
          </button>
        </li>
        </Link>

        <Link to="/register">
        <li className="nav-item">
          <button className="btn btn-primary">
            Register
          </button>
        </li>
        </Link>

      </ul>
    </div>

  </div>
</nav>

      {/* HERO SECTION */}
     <section id = "home" className="hero-section">

  <div className="container-fluid">

    <div className="row align-items-center">

      <div className="col-lg-5 hero-text">

        <h1>
          Train Silambam from <br />
          Anywhere in the World
        </h1>

        <p>
          The perfect opportunity to learn and practice traditional
          Silambam from professional instructors through our
          online training platform.
        </p>

        <Link to="/register">
        <button className="btn btn-primary hero-btn">
          Join Now
        </button>
        </Link>

      </div>

      <div className="col-lg-7 text-center">

        <img
          src="https://images.pexels.com/photos/7045444/pexels-photo-7045444.jpeg"
          alt="silambam"
          className="hero-image"
        />

      </div>

    </div>

  </div>

</section>
      {/* ABOUT ACADEMY */}
     <section id = "about" className="py-5 bg-light">
<div className="container-fluid">

<h2 className="text-center text-primary fw-bold mb-5">
About Our Academy
</h2>

<div className="row align-items-center">

<div className="col-md-6">
<img
src="https://images.unsplash.com/photo-1546519638-68e109498ffc"
className="img-fluid rounded shadow"
alt="academy"
/>
</div>

<div className="col-md-6">

<h4 className="fw-bold">
KALAIMUDHUMANI SUBRAMANIYA AASAN SILAMBA KOODAM
</h4>

<p>
Our academy is dedicated to preserving and spreading the ancient
Tamil martial art <b>Silambam</b>. Through disciplined training,
students learn traditional techniques, self-defense, physical
strength, and cultural heritage.
</p>

<p>
Over the years our students have participated in district,
state and national level competitions and have achieved
many awards in Silambam tournaments.
</p>

<p>
This online learning platform allows students from anywhere
in the world to learn authentic Silambam training.
</p>

<Link to="/about" className="btn btn-primary mt-3">
Read Full History →
</Link>

</div>

</div>

</div>
</section>
      {/* TRAINING TYPES SLIDER */}
<section id = "courses" className="py-5">
  <div className="container-fluid">

    <h2 className="text-center text-primary fw-bold mb-5">
      Training Programs
    </h2>

    <div className="training-slider">
      <div className="training-track">

        {[...courses, ...courses].map((course, index) => (
  <div
    className="training-card clickable-card"
    key={index}
    onClick={() => navigate("/publiccourse")}
  >
    <img
      src={course.image ? course.image : "https://via.placeholder.com/300"}
      alt={course.title}
    />
    <h5>{course.title}</h5>
  </div>
))}

        {/* 🔥 duplicate for infinite scroll */}
        {[...courses, ...courses].map((course, index) => (
  <div className="training-card" key={index}>
    <img
      src={course.image ? course.image : "https://via.placeholder.com/300"}
      alt={course.title}
    />
    <h5 >{course.title}</h5>
  </div>
))}

      </div>

      <Link
        to="/publiccourse"
        className="btn btn-primary mt-4"
        style={{ marginLeft: "45%" }}
      >
      View All Courses →
      </Link>

    </div>

  </div>
</section>

    <section className="py-5">
<div className="container-fluid">

<h2 className="text-center text-primary fw-bold mb-5">
Student Achievements
</h2>

<div className="row text-center">

<div className="col-md-3">
<h3 className="text-primary fw-bold">100+</h3>
<p>Competition Winners</p>
</div>

<div className="col-md-3">
<h3 className="text-primary fw-bold">50+</h3>
<p>State Level Medals</p>
</div>

<div className="col-md-3">
<h3 className="text-primary fw-bold">20+</h3>
<p>National Participants</p>
</div>

<div className="col-md-3">
<h3 className="text-primary fw-bold">15+</h3>
<p>Years of Training Excellence</p>
</div>

</div>

</div>
</section>

      {/* INSTRUCTORS */}
      <section id = "instructors">
             <h2 className="text-center text-primary fw-bold mb-5">
      Meet Our Instructors
    </h2>
   <div className="instructor-container" ref={scrollRef}>

  <div className="instructor-scroll">
           
    {loopData.map((inst, index) => (
      <div className="instructor-card-wrapper" key={index}>
        <div className="card instructor-card shadow text-center p-4">

          <img
            src={
  inst.profile_image
    ? inst.profile_image
    : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
}
            className="instructor-img mb-3"
            alt="instructor"
          />

          <h5 className="fw-bold">{inst.name}</h5>

          <p className="text-muted">
            {inst.experience}+ Years Experience in {inst.specialization}
          </p>

          <Link to={`/view-instructor/${inst.id}`}>
  <button className="btn btn-outline-primary">
    View Profile
  </button>
</Link>

        </div>
      </div>
    ))}

  </div>
</div>
</section>
      {/* GALLERY SECTION */}

<section className="py-5">
<div className="container-fluid">

<h2 className="text-center text-primary fw-bold mb-5">
Training & Competition Gallery
</h2>

{/* TRAINING IMAGES */}

<h4 className="mb-4 text-center">Training Sessions</h4>

<div className="row g-4 mb-5">

<div className="col-md-4">
<img
src="https://images.unsplash.com/photo-1599059813005-11265ba4b4ce"
className="img-fluid gallery-img"
alt="training"
/>
</div>

<div className="col-md-4">
<img
src="https://images.unsplash.com/photo-1602192103306-47e6672e8b3a"
className="img-fluid gallery-img"
alt="training"
/>
</div>

<div className="col-md-4">
<img
src="https://images.unsplash.com/photo-1521417531039-9bca14e06c03"
className="img-fluid gallery-img"
alt="training"
/>
</div>

</div>


{/* COMPETITION IMAGES */}

<h4 className="mb-4 text-center">Competitions & Achievements</h4>

<div className="row g-4">

<div className="col-md-4">
<img
src="https://images.unsplash.com/photo-1547347298-4074fc3086f0"
className="img-fluid gallery-img"
alt="competition"
/>
</div>

<div className="col-md-4">
<img
src="https://images.unsplash.com/photo-1508098682722-e99c43a406b2"
className="img-fluid gallery-img"
alt="competition"
/>
</div>

<div className="col-md-4">
<img
src="https://images.unsplash.com/photo-1517649763962-0c623066013b"
className="img-fluid gallery-img"
alt="competition"
/>
</div>

</div>

</div>
</section>
    {/* WHY LEARN WITH US */}

<section className="py-5 bg-light">
<div className="container-fluid">

<h2 className="text-center text-primary fw-bold mb-5">
Why Learn Silambam With Us
</h2>

<div className="row text-center g-4">

<div className="col-md-3">
<div className="feature-box p-4 shadow-sm">
<h4>🥋</h4>
<h5 className="fw-bold">Traditional Training</h5>
<p>
Learn authentic Silambam techniques passed through generations.
</p>
</div>
</div>

<div className="col-md-3">
<div className="feature-box p-4 shadow-sm">
<h4>🎥</h4>
<h5 className="fw-bold">Practical Video Evaluation</h5>
<p>
Students upload practice videos and instructors provide feedback.
</p>
</div>
</div>

<div className="col-md-3">
<div className="feature-box p-4 shadow-sm">
<h4>📜</h4>
<h5 className="fw-bold">Digital Certification</h5>
<p>
Get verified certificates after completing each level.
</p>
</div>
</div>

<div className="col-md-3">
<div className="feature-box p-4 shadow-sm">
<h4>🌍</h4>
<h5 className="fw-bold">Learn From Anywhere</h5>
<p>
Access lessons online and practice Silambam from anywhere.
</p>
</div>
</div>

</div>

</div>
</section>
<section id = "contact">
    <Footer />
</section>
        </div>
      
        </>
  );
}

export default HomePage;