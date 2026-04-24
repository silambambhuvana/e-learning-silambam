import React, { useEffect, useState } from "react";
import "./PublicCourse.css";
import { useNavigate } from "react-router-dom";
function PublicCourse() {

  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://127.0.0.1:8000/app1/all-courses/")
      .then(res => res.json())
      .then(data => {
        console.log(data); // debug
        setCourses(data);
      })
      .catch(err => console.log(err));
  }, []);

  const filteredCourses = courses.filter(item =>
  item.title.toLowerCase().includes(search.toLowerCase())
);

  return (
      <div className="public-course-container">

  {/* 🔍 Search Bar */}
  <div className="search-bar">
    <input
      type="text"
      placeholder="Search courses..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />
  </div>

  {filteredCourses.length === 0 ? (
  <div className="no-results">
    <h3 style={{textAlign: "center"}}>No results found </h3>
  </div>
) : (
  filteredCourses.map((item, index) => (
    <div
      className={`public-course-card ${index % 2 !== 0 ? "reverse" : ""}`}
      key={item.id}
    >
      {/* Image */}
      <div className="public-course-image-box">
        <img
          src={item.image ? item.image : "https://via.placeholder.com/400"}
          alt={item.title}
        />
      </div>

      {/* Content */}
      <div className="public-course-content">
        <h2>{item.title}</h2>
        <p>{item.description}</p>

        <button
          className="enroll-text clickable"
          onClick={() => navigate("/register")}
        >
          Register to enroll course
        </button>
      </div>
    </div>
  ))
)}
    </div>
  );
}

export default PublicCourse;