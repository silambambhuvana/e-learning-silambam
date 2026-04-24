import { useEffect, useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import DashboardNavbar from "./DashboardNavbar";
import "./StudentHomePage.css"

function StudentHome() {

  const [courses, setCourses] = useState([]);
  const [name, setName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedName = localStorage.getItem("name");
    setName(storedName);
  }, []);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await api.get("my-courses/");
      setCourses(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <DashboardNavbar />
        <div className="welcome-box">
            <h2>Welcome back, {name || "Student"} 👋</h2>
            <p>Continue your learning journey</p>
          </div>

        {/* MAIN CONTENT */}
        <div className="main-content">
           <button
  onClick={() => navigate("/courses")}
  style={{
    marginBottom: "20px",
    background: "#2b4a8b",
    color: "white",
    border: "none",
    padding: "8px 16px",
    borderRadius: "6px",
    cursor: "pointer"
  }}
>
  All Courses
</button>
          <h3 className="section-title">My Courses</h3>

          {/* EMPTY */}
          {courses.length === 0 && (
            <p className="empty-text">
              No enrolled courses yet 🚀
            </p>
          )}

          {/* COURSE LIST */}
          {courses.map((c) => (
            <div className="course-row" key={c.id}>
              
              
            <div className="course-img"  >     
  {/* ✅ COURSE IMAGE */}
  <img
    src={c.image ? `http://127.0.0.1:8000${c.image}` : "/default.jpg"}
    alt="course"
    className="course-img"
  />
  </div>

<div className="course-info">
  {/* ✅ TITLE */}
  <h4>{c.title}</h4>

</div>

              <div className="progress-section">
                <div className="progress-bar">
                    <div style={{
              width: `${c.progress || 0}%`,
              height: "100%",
              background:c.progress === 100
                            ? "green" : c.progress > 50
                            ? "orange" : "red"
              
            }}/>
                </div>
               <p>{c.progress || 0}% Completed</p>
              </div>

              <button
                className="continue-btn"
                onClick={() => navigate(`/student-course/${c.id}`)}
              >
                Continue ▶
              </button>

            </div>
          ))}

        </div>
    </>
  );
}

export default StudentHome;